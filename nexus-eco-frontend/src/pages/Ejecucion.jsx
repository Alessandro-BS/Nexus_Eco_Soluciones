import React, { useState, useEffect } from 'react';
import { MdClose, MdSave, MdCloudUpload, MdImage, MdPictureAsPdf, MdSubject, MdStorage, MdOpenInNew, MdVisibility, MdArrowBack } from 'react-icons/md';
import { getOrdenes, createPlanificacion, createEjecucion, getEjecuciones } from '../api/api';
import './Ejecucion.css';

const formatOS = (id) => `OS-2026-${String(id).padStart(4, '0')}`;

const Ejecucion = () => {
    const [view, setView] = useState('list'); // 'list' or 'detail'
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrden, setSelectedOrden] = useState(null);

    const [ejecucion, setEjecucion] = useState({
        fecha: new Date().toISOString().split('T')[0],
        resultado: 'Satisfactorio (Pass)',
        observaciones: ''
    });

    useEffect(() => {
        if (view === 'list') {
            fetchOrdenes();
        }
    }, [view]);

    const fetchOrdenes = async () => {
        setLoading(true);
        try {
            const res = await getOrdenes();
            setOrdenes(res.data);
        } catch (error) {
            console.error("Error fetching ordenes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOrden = (orden) => {
        setSelectedOrden(orden);
        setView('detail');
    };

    const handleGuardarEjecucion = async () => {
        try {
            // 1. Create dummy planificacion under the hood to satisfy SQL Constraint
            const planPayload = {
                fechaProgramada: new Date(ejecucion.fecha).toISOString(),
                estadoPlan: 'EJECUTADO',
                ordenServicio: { idOrdenServicio: selectedOrden.idOrdenServicio }
            };
            const planRes = await createPlanificacion(planPayload);
            const idPlan = planRes.data.idPlanificacionServicio;

            // 2. Create the ejecucion
            const ejecPayload = {
                fechaEjecucion: new Date(ejecucion.fecha).toISOString(),
                resultado: ejecucion.resultado,
                observacionesEj: ejecucion.observaciones,
                planificacionServicio: { idPlanificacionServicio: idPlan }
            };
            await createEjecucion(ejecPayload);
            
            alert("Ejecución guardada correctamente!");
            setEjecucion({ fecha: new Date().toISOString().split('T')[0], resultado: 'Satisfactorio (Pass)', observaciones: '' });
            setView('list');
            
        } catch (error) {
            console.error("Error al guardar ejecución", error);
            alert("Ocurrió un error al guardar.");
        }
    };

    if (view === 'list') {
        return (
            <div className="ejecucion-page">
                <div className="breadcrumb">GESTIÓN / EJECUCIÓN</div>
                
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Seleccionar Orden para Ejecutar</h1>
                        <p className="page-subtitle">Elija una Orden de Servicio de la lista para registrar su ejecución.</p>
                    </div>
                </div>

                <div className="table-container" style={{background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                            <tr style={{background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#64748b'}}>
                                <th style={{padding: '16px'}}>ORDEN SERVICIO</th>
                                <th style={{padding: '16px'}}>FECHA ORDEN</th>
                                <th style={{padding: '16px'}}>CLIENTE</th>
                                <th style={{padding: '16px'}}>ESTADO</th>
                                <th style={{padding: '16px'}}>ACCIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Cargando...</td></tr>
                            ) : ordenes.length === 0 ? (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No hay órdenes de servicio pendientes.</td></tr>
                            ) : (
                                ordenes.map(ord => (
                                    <tr key={ord.idOrdenServicio} style={{borderBottom: '1px solid #f1f5f9'}}>
                                        <td style={{padding: '16px', fontWeight: 'bold'}}>{formatOS(ord.idOrdenServicio)}</td>
                                        <td style={{padding: '16px'}}>{new Date(ord.fechaOrden).toLocaleDateString()}</td>
                                        <td style={{padding: '16px'}}>{ord.solicitudServicio?.cliente?.razonSocial}</td>
                                        <td style={{padding: '16px'}}>{ord.estadoOrden}</td>
                                        <td style={{padding: '16px'}}>
                                            <button 
                                                className="btn-outline" 
                                                style={{padding: '6px 12px', fontSize: '12px'}}
                                                onClick={() => handleSelectOrden(ord)}
                                            >
                                                Registrar Ejecución
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="ejecucion-page">
            <div className="breadcrumb">
                <span className="badge-dark">EJECUCION_SERVICIO</span> / NUEVA_EJECUCION
            </div>
            
            <div className="page-header">
                <div>
                    <h1 className="page-title">Ejecución de Servicio</h1>
                    <button className="btn-cancelar" style={{marginTop: '10px'}} onClick={() => setView('list')}>
                        <MdArrowBack size={16} /> Volver a lista
                    </button>
                </div>
                <div className="header-actions">
                    <button className="btn-guardar" onClick={handleGuardarEjecucion}>
                        <MdSave size={16} /> Guardar ejecución
                    </button>
                </div>
            </div>

            <div className="top-layout">
                <div className="form-card">
                    <h2 className="card-title">Detalles de la ejecución</h2>
                    
                    <div className="form-group mb-16">
                        <label>Orden a Ejecutar (Referencia)</label>
                        <input type="text" readOnly value={formatOS(selectedOrden?.idOrdenServicio)} style={{width: '100%', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0'}} />
                        <div className="reference-badges" style={{marginTop: '10px', display: 'flex', gap: '10px'}}>
                            <span className="ref-badge" style={{background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>
                                <strong>CLIENTE:</strong> {selectedOrden?.solicitudServicio?.cliente?.razonSocial}
                            </span>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Fecha de ejecución</label>
                            <input 
                                type="date" 
                                value={ejecucion.fecha} 
                                onChange={(e) => setEjecucion({...ejecucion, fecha: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <label>Resultado</label>
                            <select 
                                value={ejecucion.resultado} 
                                onChange={(e) => setEjecucion({...ejecucion, resultado: e.target.value})}
                            >
                                <option value="Satisfactorio (Pass)">Satisfactorio (Pass)</option>
                                <option value="No Satisfactorio">No Satisfactorio</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group mt-16">
                        <label>Observaciones del técnico</label>
                        <textarea 
                            placeholder="Describa cualquier incidencia o detalle relevante durante la ejecución..."
                            rows="4"
                            value={ejecucion.observaciones}
                            onChange={(e) => setEjecucion({...ejecucion, observaciones: e.target.value})}
                        ></textarea>
                    </div>
                </div>

                <div className="upload-card">
                    <div className="upload-header">
                        <div>
                            <h2 className="card-title inline-title">Evidencias del servicio</h2>
                            <span className="badge-green-light">PENDIENTE MONGODB</span>
                        </div>
                        <p className="upload-subtitle">Esta sección se conectará a MongoDB en la Fase 6</p>
                    </div>

                    <div className="dropzone" style={{opacity: 0.5, pointerEvents: 'none'}}>
                        <MdCloudUpload size={32} className="dropzone-icon" />
                        <h3>Arrastra archivos aquí o haz clic</h3>
                        <p>JPG, PNG, PDF o Actas Firmadas (Max 10MB)</p>
                        <button className="btn-subir" style={{background: '#cbd5e1', cursor: 'not-allowed'}}>Subir evidencia</button>
                    </div>

                    <div className="evidence-list" style={{opacity: 0.5}}>
                        <div className="evidence-item">
                            <div className="evidence-icon-wrapper blue-light">
                                <MdImage size={20} className="icon-blue" />
                            </div>
                            <div className="evidence-info">
                                <h4>Foto del servicio</h4>
                                <p>Función deshabilitada (Fase 6)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ejecucion;
