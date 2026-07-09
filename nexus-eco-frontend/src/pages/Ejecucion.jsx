import React, { useState, useEffect, useRef } from 'react';
import { MdClose, MdSave, MdCloudUpload, MdImage, MdPictureAsPdf, MdSubject, MdStorage, MdOpenInNew, MdVisibility, MdArrowBack } from 'react-icons/md';
import { getOrdenes, createPlanificacion, createEjecucion, uploadEvidencia } from '../api/api';
import './Ejecucion.css';

const formatOS = (id) => `OS-2026-${String(id).padStart(4, '0')}`;

const Ejecucion = () => {
    const [view, setView] = useState('list');
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrden, setSelectedOrden] = useState(null);

    const [ejecucion, setEjecucion] = useState({
        fecha: new Date().toISOString().split('T')[0],
        resultado: 'Satisfactorio (Pass)',
        observaciones: '',
        mongoDocId: null,
        archivoSubido: null
    });
    
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await uploadEvidencia(file);
            // res.data = { mongo_doc_id: "...", nombre: "..." }
            setEjecucion(prev => ({ 
                ...prev, 
                mongoDocId: res.data.mongo_doc_id,
                archivoSubido: res.data.nombre
            }));
            alert("Archivo subido a MongoDB con éxito");
        } catch (error) {
            console.error("Error uploading file", error);
            alert("Error al subir el archivo.");
        } finally {
            setUploading(false);
        }
    };

    const handleGuardarEjecucion = async () => {
        try {
            const planPayload = {
                fechaProgramada: new Date(ejecucion.fecha).toISOString(),
                estadoPlan: 'EJECUTADO',
                ordenServicio: { idOrdenServicio: selectedOrden.idOrdenServicio }
            };
            const planRes = await createPlanificacion(planPayload);
            const idPlan = planRes.data.idPlanificacionServicio;

            const ejecPayload = {
                fechaEjecucion: new Date(ejecucion.fecha).toISOString(),
                resultado: ejecucion.resultado,
                observacionesEj: ejecucion.observaciones,
                mongoDocId: ejecucion.mongoDocId, // Link to MongoDB document
                planificacionServicio: { idPlanificacionServicio: idPlan }
            };
            await createEjecucion(ejecPayload);
            
            alert("Ejecución guardada correctamente!");
            setEjecucion({ fecha: new Date().toISOString().split('T')[0], resultado: 'Satisfactorio (Pass)', observaciones: '', mongoDocId: null, archivoSubido: null });
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
                        <p className="page-subtitle">Elija una Orden de Servicio de la lista para registrar su ejecución y subir evidencias.</p>
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
                                        <td style={{padding: '16px'}}>
                                            <span className={`status-badge status-${ord.estadoOrden?.toLowerCase()}`}>
                                                {ord.estadoOrden?.replace('_', ' ')}
                                            </span>
                                        </td>
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
                        </div>
                        <p className="upload-subtitle">Sube tu PDF o fotos de la ejecución.</p>
                    </div>

                    <div className="dropzone" onClick={() => fileInputRef.current.click()} style={{cursor: 'pointer'}}>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{display: 'none'}} 
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.png,.jpeg"
                        />
                        <MdCloudUpload size={32} className="dropzone-icon" />
                        <h3>{uploading ? 'Subiendo...' : 'Haz clic para seleccionar archivo'}</h3>
                        <p>JPG, PNG, PDF (Max 10MB)</p>
                        <button className="btn-subir" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }} disabled={uploading}>
                            {uploading ? 'Procesando...' : 'Subir evidencia'}
                        </button>
                    </div>

                    <div className="evidence-list">
                        <div className="evidence-item">
                            <div className="evidence-icon-wrapper blue-light">
                                <MdPictureAsPdf size={20} className="icon-blue" />
                            </div>
                            <div className="evidence-info">
                                <h4>Archivo adjunto</h4>
                                <p>{ejecucion.archivoSubido ? ejecucion.archivoSubido : 'Ningún archivo subido'}</p>
                                {ejecucion.mongoDocId && <span style={{fontSize: '11px', color: '#10b981'}}>ID: {ejecucion.mongoDocId}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ejecucion;
