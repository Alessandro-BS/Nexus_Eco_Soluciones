import React, { useState, useEffect, useRef } from 'react';
import { 
    MdClose, MdSave, MdCloudUpload, MdImage, MdPictureAsPdf, 
    MdVisibility, MdArrowBack, MdDownload 
} from 'react-icons/md';
import { 
    getPlanificaciones, getEjecuciones, createEjecucion, 
    updateEjecucion, uploadEvidencia 
} from '../api/api';
import './Ejecucion.css';

const formatPlan = (id) => `PLAN-2026-${String(id).padStart(4, '0')}`;
const formatOS = (id) => `OS-2026-${String(id).padStart(4, '0')}`;

const Ejecucion = () => {
    const [view, setView] = useState('list'); // 'list', 'form'
    const [planificaciones, setPlanificaciones] = useState([]);
    const [executions, setExecutions] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Selected Context
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [editingId, setEditingId] = useState(null);

    // Form fields
    const [form, setForm] = useState({
        fechaEjecucion: new Date().toISOString().split('T')[0],
        resultado: 'Satisfactorio (Pass)',
        observacionesEj: '',
        mongoDocId: null,
        archivoSubido: null
    });
    
    // Details modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailedExecution, setDetailedExecution] = useState(null);
    const [detailedPlan, setDetailedPlan] = useState(null);

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (view === 'list') {
            fetchData();
        }
    }, [view]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resPlans, resExecs] = await Promise.all([
                getPlanificaciones(),
                getEjecuciones()
            ]);
            setPlanificaciones(resPlans.data);
            setExecutions(resExecs.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (plan, exec = null) => {
        setSelectedPlan(plan);
        if (exec) {
            setEditingId(exec.idEjecucionService || exec.idEjecucionServicio);
            setForm({
                fechaEjecucion: exec.fechaEjecucion ? exec.fechaEjecucion.split('T')[0] : new Date().toISOString().split('T')[0],
                resultado: exec.resultado || 'Satisfactorio (Pass)',
                observacionesEj: exec.observacionesEj || '',
                mongoDocId: exec.mongoDocId || null,
                archivoSubido: exec.mongoDocId ? 'Evidencia guardada en MongoDB' : null
            });
        } else {
            setEditingId(null);
            setForm({
                fechaEjecucion: new Date().toISOString().split('T')[0],
                resultado: 'Satisfactorio (Pass)',
                observacionesEj: '',
                mongoDocId: null,
                archivoSubido: null
            });
        }
        setView('form');
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await uploadEvidencia(file);
            setForm(prev => ({ 
                ...prev, 
                mongoDocId: res.data.mongo_doc_id,
                archivoSubido: res.data.nombre
            }));
            alert("Archivo subido a MongoDB Compass exitosamente");
        } catch (error) {
            console.error("Error uploading file", error);
            alert("Error al subir el archivo.");
        } finally {
            setUploading(false);
        }
    };

    const handleGuardarEjecucion = async () => {
        if (!form.fechaEjecucion || !form.resultado) {
            alert("La fecha y resultado son requeridos.");
            return;
        }

        try {
            const payload = {
                idEjecucionServicio: editingId,
                fechaEjecucion: `${form.fechaEjecucion}T00:00:00`,
                resultado: form.resultado,
                observacionesEj: form.observacionesEj,
                mongoDocId: form.mongoDocId,
                planificacionServicio: { idPlanificacionServicio: selectedPlan.idPlanificacionServicio }
            };

            if (editingId) {
                await updateEjecucion(editingId, payload);
                alert("Registro de ejecución actualizado correctamente!");
            } else {
                await createEjecucion(payload);
                alert("Ejecución del servicio registrada correctamente!");
            }
            
            setView('list');
        } catch (error) {
            console.error("Error al guardar ejecución", error);
            alert("Ocurrió un error al guardar la ejecución en la base de datos.");
        }
    };

    const handleOpenDetails = (plan, exec) => {
        setDetailedPlan(plan);
        setDetailedExecution(exec);
        setShowDetailsModal(true);
    };

    const handleDownloadEvidencias = (execId) => {
        if (!execId) return;
        window.open(`http://localhost:8080/api/ejecucion-servicios/${execId}/evidencias/download`, '_blank');
    };

    return (
        <div className="ejecucion-page">
            <div className="breadcrumb">OPERATIVO / EJECUCIÓN</div>

            {view === 'list' ? (
                <>
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Ejecución de Servicios (Planificaciones)</h1>
                            <p className="page-subtitle">Visualiza la lista de visitas programadas, registra resultados y administra evidencias.</p>
                        </div>
                    </div>

                    <div className="table-container" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>
                                    <th style={{ padding: '16px' }}>PLAN / ORDEN</th>
                                    <th style={{ padding: '16px' }}>FECHA PROGRAMADA</th>
                                    <th style={{ padding: '16px' }}>CLIENTE</th>
                                    <th style={{ padding: '16px' }}>ESTADO PLAN</th>
                                    <th style={{ padding: '16px' }}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Cargando...</td></tr>
                                ) : planificaciones.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No hay planificaciones registradas en el sistema.</td></tr>
                                ) : (
                                    planificaciones.map(p => {
                                        const exec = executions.find(e => e.planificacionServicio?.idPlanificacionServicio === p.idPlanificacionServicio);
                                        const execId = exec ? (exec.idEjecucionService || exec.idEjecucionServicio) : null;
                                        
                                        return (
                                            <tr key={p.idPlanificacionServicio} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ fontWeight: 'bold' }}>{formatPlan(p.idPlanificacionServicio)}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{p.ordenServicio ? formatOS(p.ordenServicio.idOrdenServicio) : '-'}</div>
                                                </td>
                                                <td style={{ padding: '16px' }}>{p.fechaProgramada ? p.fechaProgramada.split('T')[0] : '-'}</td>
                                                <td style={{ padding: '16px' }}>{p.ordenServicio?.solicitudServicio?.cliente?.razonSocial || 'Desconocido'}</td>
                                                <td style={{ padding: '16px' }}>
                                                    <span className={`status-badge status-${p.estadoPlan?.toLowerCase()}`}>
                                                        {p.estadoPlan}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    {exec ? (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button 
                                                                className="btn-table-details"
                                                                onClick={() => handleOpenDetails(p, exec)}
                                                                style={{ padding: '6px 12px', fontSize: '12px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                            >
                                                                <MdVisibility size={14} /> Ver
                                                            </button>
                                                            <button 
                                                                className="btn-table-edit"
                                                                onClick={() => handleSelectPlan(p, exec)}
                                                                style={{ padding: '6px 12px', fontSize: '12px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', cursor: 'pointer', borderRadius: '4px' }}
                                                            >
                                                                Editar Registro
                                                            </button>
                                                            <button 
                                                                className="btn-download"
                                                                onClick={() => handleDownloadEvidencias(execId)}
                                                                style={{ padding: '6px 12px', fontSize: '12px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                                title="Descargar Evidencias (.ZIP)"
                                                            >
                                                                <MdDownload size={14} /> Evidencias
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            className="btn-outline" 
                                                            style={{ padding: '6px 12px', fontSize: '12px', background: '#003b5c', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                                                            onClick={() => handleSelectPlan(p, null)}
                                                        >
                                                            Registrar Ejecución
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <>
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">{editingId ? 'Editar Ejecución' : 'Registrar Ejecución'}</h1>
                            <p className="page-subtitle">Suba archivos de evidencia firmados y detalle las observaciones encontradas.</p>
                            <button className="btn-cancelar" style={{ marginTop: '10px' }} onClick={() => setView('list')}>
                                <MdArrowBack size={16} /> Volver
                            </button>
                        </div>
                        <div className="header-actions">
                            <button className="btn-guardar" onClick={handleGuardarEjecucion} style={{ background: '#003b5c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <MdSave size={16} /> Guardar Registro
                            </button>
                        </div>
                    </div>

                    <div className="top-layout">
                        <div className="form-card">
                            <h2 className="card-title">Detalles de la ejecución</h2>
                            
                            <div className="form-group mb-16">
                                <label>Planificación Asociada (Referencia)</label>
                                <input type="text" readOnly value={`${formatPlan(selectedPlan?.idPlanificacionServicio)} - ${selectedPlan?.ordenServicio?.solicitudServicio?.cliente?.razonSocial || 'Cliente'}`} style={{ width: '100%', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Fecha de ejecución</label>
                                    <input 
                                        type="date" 
                                        value={form.fechaEjecucion} 
                                        onChange={(e) => setForm({...form, fechaEjecucion: e.target.value})} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Resultado</label>
                                    <select 
                                        value={form.resultado} 
                                        onChange={(e) => setForm({...form, resultado: e.target.value})}
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
                                    value={form.observacionesEj}
                                    onChange={(e) => setForm({...form, observacionesEj: e.target.value})}
                                ></textarea>
                            </div>
                        </div>

                        <div className="upload-card">
                            <div className="upload-header">
                                <h2 className="card-title inline-title">Evidencias del servicio</h2>
                                <p className="upload-subtitle">Sube tu hoja de servicio firmada o fotos del campo a MongoDB.</p>
                            </div>

                            <div className="dropzone" onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer' }}>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.png,.jpeg"
                                />
                                <MdCloudUpload size={32} className="dropzone-icon" />
                                <h3>{uploading ? 'Subiendo...' : 'Haz clic para seleccionar archivo'}</h3>
                                <p>JPG, PNG, PDF (Max 15MB)</p>
                                <button className="btn-subir" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }} disabled={uploading}>
                                    {uploading ? 'Procesando...' : 'Seleccionar archivo'}
                                </button>
                            </div>

                            <div className="evidence-list" style={{ marginTop: '16px' }}>
                                <div className="evidence-item">
                                    <div className="evidence-icon-wrapper blue-light">
                                        <MdPictureAsPdf size={20} className="icon-blue" />
                                    </div>
                                    <div className="evidence-info">
                                        <h4>Hoja de Servicio Firmada</h4>
                                        <p>{form.archivoSubido ? form.archivoSubido : 'Ningún archivo subido aún.'}</p>
                                        {form.mongoDocId && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>ID Mongo: {form.mongoDocId}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Details Modal */}
            {showDetailsModal && detailedPlan && detailedExecution && (
                <div className="modal-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 1000 }}>
                    <div className="modal-content" style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '550px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                            <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Detalles de Ejecución: {formatPlan(detailedPlan.idPlanificacionServicio)}</h2>
                            <button className="btn-close" onClick={() => setShowDetailsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                <MdClose size={22} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div><strong>Planificación:</strong> {formatPlan(detailedPlan.idPlanificacionServicio)}</div>
                                <div><strong>Orden de Servicio:</strong> {detailedPlan.ordenServicio ? formatOS(detailedPlan.ordenServicio.idOrdenServicio) : '-'}</div>
                                <div><strong>Cliente:</strong> {detailedPlan.ordenServicio?.solicitudServicio?.cliente?.razonSocial || 'Desconocido'}</div>
                                <div><strong>Ubicación:</strong> {detailedPlan.ubicacion ? `${detailedPlan.ubicacion.calle}, ${detailedPlan.ubicacion.distrito}` : '-'}</div>
                                <div><strong>Fecha Ejecución:</strong> {detailedExecution.fechaEjecucion?.split('T')[0]}</div>
                                <div><strong>Resultado de Servicio:</strong> <span style={{ fontWeight: 'bold', color: detailedExecution.resultado?.includes('Satisfactorio') ? '#10b981' : '#ef4444' }}>{detailedExecution.resultado}</span></div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                                <strong>Observaciones de Ejecución:</strong>
                                <p style={{ fontStyle: 'italic', margin: '4px 0 0 0' }}>{detailedExecution.observacionesEj || 'Sin observaciones registradas.'}</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', padding: '12px', borderRadius: '4px' }}>
                                <div>
                                    <strong>Documentos Adjuntos (GridFS):</strong>
                                    <div style={{ fontSize: '12px', color: '#2563eb' }}>{detailedExecution.mongoDocId ? 'Evidencias subidas correctamente.' : 'Sin archivos adjuntos.'}</div>
                                </div>
                                {detailedExecution.mongoDocId && (
                                    <button 
                                        onClick={() => handleDownloadEvidencias(detailedExecution.idEjecucionService || detailedExecution.idEjecucionServicio)}
                                        style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <MdDownload size={14} /> Descargar ZIP
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ejecucion;
