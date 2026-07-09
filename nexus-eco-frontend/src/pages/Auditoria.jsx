import React, { useState, useEffect } from 'react';
import { 
    MdOutlineChecklist, 
    MdWarningAmber, 
    MdCheckCircleOutline, 
    MdOutlinePictureAsPdf,
    MdFileDownload,
    MdPowerSettingsNew,
    MdStar,
    MdStarBorder,
    MdAddAlert,
    MdKeyboardArrowRight,
    MdHelpOutline,
    MdArrowBack,
    MdSearch,
    MdClose
} from 'react-icons/md';
import { getEjecuciones, getAuditorias, createAuditoria, getIncidentes, createIncidente, getEmpleados } from '../api/api';
import './Auditoria.css';

const formatOS = (id) => `OS-2026-${String(id).padStart(4, '0')}`;

const Auditoria = () => {
    const [view, setView] = useState('list'); // 'list', 'detail'
    const [ejecuciones, setEjecuciones] = useState([]);
    const [selectedEjecucion, setSelectedEjecucion] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Detail Data
    const [auditorias, setAuditorias] = useState([]);
    const [incidentes, setIncidentes] = useState([]);
    const [empleados, setEmpleados] = useState([]);

    // Modal State
    const [showAuditoriaModal, setShowAuditoriaModal] = useState(false);
    const [showIncidenteModal, setShowIncidenteModal] = useState(false);

    // Form states
    const [newAuditoria, setNewAuditoria] = useState({ calificacion: 5, observacionesAud: '', idEmpleado: '' });
    const [newIncidente, setNewIncidente] = useState({ tipoIncidente: '', descripcionInc: '', gravedad: 'MEDIA' });

    useEffect(() => {
        if (view === 'list') {
            fetchEjecuciones();
        } else if (view === 'detail' && selectedEjecucion) {
            fetchDetailData();
        }
    }, [view, selectedEjecucion]);

    const fetchEjecuciones = async () => {
        setLoading(true);
        try {
            const res = await getEjecuciones();
            setEjecuciones(res.data);
        } catch (error) {
            console.error("Error fetching ejecuciones", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetailData = async () => {
        try {
            const [audRes, incRes, empRes] = await Promise.all([
                getAuditorias(),
                getIncidentes(),
                getEmpleados()
            ]);
            // Filter by selected ejecucion locally
            setAuditorias(audRes.data.filter(a => a.ejecucionServicio?.idEjecucionServicio === selectedEjecucion.idEjecucionServicio));
            setIncidentes(incRes.data.filter(i => i.ejecucionServicio?.idEjecucionServicio === selectedEjecucion.idEjecucionServicio));
            setEmpleados(empRes.data);
            
            if (empRes.data.length > 0) {
                setNewAuditoria(prev => ({ ...prev, idEmpleado: empRes.data[0].idEmpleado }));
            }
        } catch (error) {
            console.error("Error fetching detail data", error);
        }
    };

    const handleSelectEjecucion = (ejec) => {
        setSelectedEjecucion(ejec);
        setView('detail');
    };

    const handleSaveAuditoria = async () => {
        try {
            const payload = {
                fechaAuditoria: new Date().toISOString(),
                calificacion: newAuditoria.calificacion,
                observacionesAud: newAuditoria.observacionesAud,
                ejecucionServicio: { idEjecucionServicio: selectedEjecucion.idEjecucionServicio },
                empleado: { idEmpleado: newAuditoria.idEmpleado }
            };
            await createAuditoria(payload);
            alert("Auditoría registrada exitosamente!");
            setShowAuditoriaModal(false);
            setNewAuditoria({ calificacion: 5, observacionesAud: '', idEmpleado: empleados[0]?.idEmpleado || '' });
            fetchDetailData();
        } catch (error) {
            console.error("Error creating auditoria", error);
            alert("Error al guardar la auditoría");
        }
    };

    const handleSaveIncidente = async () => {
        try {
            const payload = {
                tipoIncidente: newIncidente.tipoIncidente,
                descripcionInc: newIncidente.descripcionInc,
                gravedad: newIncidente.gravedad,
                estadoInc: 'REPORTADO',
                ejecucionServicio: { idEjecucionServicio: selectedEjecucion.idEjecucionServicio }
            };
            await createIncidente(payload);
            alert("Incidente registrado exitosamente!");
            setShowIncidenteModal(false);
            setNewIncidente({ tipoIncidente: '', descripcionInc: '', gravedad: 'MEDIA' });
            fetchDetailData();
        } catch (error) {
            console.error("Error creating incidente", error);
            alert("Error al guardar el incidente");
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<MdStar key={i} className="star-filled" />);
            } else {
                stars.push(<MdStarBorder key={i} className="star-empty" />);
            }
        }
        return stars;
    };

    if (view === 'list') {
        return (
            <div className="auditoria-page">
                <div className="breadcrumb">GESTIÓN / AUDITORÍAS</div>
                
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Seleccionar Ejecución de Servicio</h1>
                        <p className="page-subtitle">Seleccione una ejecución para auditar o reportar incidentes.</p>
                    </div>
                </div>

                <div className="table-container" style={{background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                            <tr style={{background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#64748b'}}>
                                <th style={{padding: '16px'}}>ID ORDEN (EJECUCIÓN)</th>
                                <th style={{padding: '16px'}}>FECHA EJECUCIÓN</th>
                                <th style={{padding: '16px'}}>RESULTADO</th>
                                <th style={{padding: '16px'}}>ACCIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Cargando...</td></tr>
                            ) : ejecuciones.length === 0 ? (
                                <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No hay ejecuciones de servicio registradas.</td></tr>
                            ) : (
                                ejecuciones.map(ej => (
                                    <tr key={ej.idEjecucionServicio} style={{borderBottom: '1px solid #f1f5f9'}}>
                                        <td style={{padding: '16px', fontWeight: 'bold'}}>{formatOS(ej.planificacionServicio?.ordenTrabajo?.ordenServicio?.idOrdenServicio || ej.idEjecucionServicio)}</td>
                                        <td style={{padding: '16px'}}>{new Date(ej.fechaEjecucion).toLocaleDateString()}</td>
                                        <td style={{padding: '16px'}}>{ej.resultado || 'N/A'}</td>
                                        <td style={{padding: '16px'}}>
                                            <button 
                                                className="btn-outline" 
                                                style={{padding: '6px 12px', fontSize: '12px'}}
                                                onClick={() => handleSelectEjecucion(ej)}
                                            >
                                                Ver Auditoría
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
        <div className="auditoria-page">
            <div className="breadcrumb">
                SERVICIOS / <span className="breadcrumb-highlight">ORDEN_SERVICIO #{formatOS(selectedEjecucion?.planificacionServicio?.ordenTrabajo?.ordenServicio?.idOrdenServicio || selectedEjecucion?.idEjecucionServicio)}</span>
            </div>
            
            <div className="page-header">
                <div>
                    <h1 className="page-title">Auditoría y Cierre de Servicio</h1>
                    <button className="btn-outline" style={{marginTop: '10px'}} onClick={() => setView('list')}>
                        <MdArrowBack size={16} /> Volver a lista
                    </button>
                </div>
                <div className="header-actions">
                    <button className="btn-outline" onClick={() => setShowAuditoriaModal(true)}>
                        <MdOutlineChecklist size={18} /> Registrar auditoría
                    </button>
                    <button className="btn-outline" onClick={() => setShowIncidenteModal(true)}>
                        <MdWarningAmber size={18} /> Registrar incidente
                    </button>
                    <button className="btn-primary">
                        <MdCheckCircleOutline size={18} /> Generar informe final
                    </button>
                </div>
            </div>

            <div className="top-layout">
                <div className="left-column">
                    <div className="section-title">
                        <MdOutlineChecklist size={20} />
                        HISTORIAL DE AUDITORÍAS (TABLE: AUDITORIA)
                    </div>
                    <div className="table-card">
                        <table className="auditoria-table">
                            <thead>
                                <tr>
                                    <th>EMPLEADO AUDITOR</th>
                                    <th>FECHA</th>
                                    <th>CALIFICACIÓN</th>
                                    <th>OBSERVACIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditorias.length === 0 ? (
                                    <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No hay auditorías registradas</td></tr>
                                ) : (
                                    auditorias.map(aud => (
                                        <tr key={aud.idAuditoria}>
                                            <td>
                                                <div className="auditor-info">
                                                    <div className="avatar blue-bg">{aud.empleado?.nombreEmp?.charAt(0) || 'U'}</div>
                                                    <span className="auditor-name">{aud.empleado?.nombreEmp}<br/>{aud.empleado?.apellidoEmp}</span>
                                                </div>
                                            </td>
                                            <td>{new Date(aud.fechaAuditoria).toLocaleDateString()}</td>
                                            <td>
                                                <div className="rating">
                                                    {renderStars(aud.calificacion)}
                                                    <span className="rating-score">{aud.calificacion}.0</span>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="obs-text">{aud.observacionesAud}</p>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="right-column">
                    <div className="section-title">
                        <MdOutlinePictureAsPdf size={20} />
                        INFORME FINAL (TABLE: INFORME_SERVICIO)
                    </div>
                    <div className="informe-card">
                        <div className="informe-header">
                            <div>
                                <div className="informe-label">ÚLTIMA GENERACIÓN</div>
                                <div className="informe-date">Pendiente</div>
                            </div>
                            <span className="badge-enviado" style={{background: '#e2e8f0', color: '#64748b'}}>NO GENERADO</span>
                        </div>
                        
                        <div className="pdf-box" style={{opacity: 0.5}}>
                            <MdOutlinePictureAsPdf size={32} className="pdf-icon" />
                            <div className="pdf-info">
                                <h4>Informe_no_disponible.pdf</h4>
                                <p>Generar informe primero</p>
                            </div>
                        </div>

                        <button className="btn-cerrar-servicio">
                            <MdPowerSettingsNew size={20} />
                            <div>
                                CERRAR SERVICIO<br/>(ORDEN_SERVICIO)
                            </div>
                        </button>
                        <p className="cerrar-warning">ESTA ACCIÓN ES IRREVERSIBLE Y ARCHIVA LA ORDEN</p>
                    </div>
                </div>
            </div>

            <div className="section-title mt-24">
                <MdWarningAmber size={20} />
                GESTIÓN DE INCIDENCIAS (TABLE: INCIDENTE)
            </div>
            
            <div className="incidencias-grid">
                {incidentes.map(inc => (
                    <div className="incidencia-card" key={inc.idIncidente}>
                        <div className="incidencia-header">
                            <span className={`badge-${inc.gravedad?.toLowerCase() === 'alta' ? 'critica' : inc.gravedad?.toLowerCase() === 'media' ? 'media' : 'baja'}`}>
                                {inc.gravedad || 'MEDIA'}
                            </span>
                            <span className="incidencia-id">ID: INC-{inc.idIncidente}</span>
                        </div>
                        <h3 className="incidencia-title">{inc.tipoIncidente}</h3>
                        <p className="incidencia-desc">{inc.descripcionInc}</p>
                        <div className="incidencia-footer" style={{marginTop: '16px'}}>
                            <span className={`status-${inc.estadoInc?.toLowerCase() === 'resuelto' ? 'resuelta' : 'pendiente'}`}>
                                <span className={inc.estadoInc?.toLowerCase() === 'resuelto' ? 'dot-green' : 'dot-red'}></span> {inc.estadoInc}
                            </span>
                            <a href="#" className="link-gestionar">Gestionar <MdKeyboardArrowRight size={18} /></a>
                        </div>
                    </div>
                ))}

                <div className="incidencia-card dashed" onClick={() => setShowIncidenteModal(true)} style={{cursor: 'pointer'}}>
                    <div className="add-icon-wrapper">
                        <MdAddAlert size={24} />
                    </div>
                    <h3 className="incidencia-title text-center">Registrar Nueva Incidencia</h3>
                    <p className="incidencia-desc text-center">Documentar fallo operativo o desviación de protocolo de seguridad.</p>
                </div>
            </div>

            {/* Modal Auditoría */}
            {showAuditoriaModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Registrar Auditoría</h3>
                            <MdClose style={{cursor: 'pointer'}} onClick={() => setShowAuditoriaModal(false)} />
                        </div>
                        <div className="modal-body">
                            <div className="form-group mb-20">
                                <label style={{display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px'}}>Empleado Auditor</label>
                                <select 
                                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1'}}
                                    value={newAuditoria.idEmpleado} 
                                    onChange={(e) => setNewAuditoria({...newAuditoria, idEmpleado: e.target.value})}
                                >
                                    {empleados.map(emp => (
                                        <option key={emp.idEmpleado} value={emp.idEmpleado}>{emp.nombreEmp} {emp.apellidoEmp}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group mb-20">
                                <label style={{display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px'}}>Calificación (1-5)</label>
                                <input 
                                    type="number" min="1" max="5" 
                                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1'}}
                                    value={newAuditoria.calificacion} 
                                    onChange={(e) => setNewAuditoria({...newAuditoria, calificacion: parseInt(e.target.value)})}
                                />
                            </div>
                            <div className="form-group mb-20">
                                <label style={{display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px'}}>Observaciones</label>
                                <textarea 
                                    rows="4" 
                                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical'}}
                                    value={newAuditoria.observacionesAud}
                                    onChange={(e) => setNewAuditoria({...newAuditoria, observacionesAud: e.target.value})}
                                />
                            </div>
                            <button className="btn-primary" style={{width: '100%', padding: '10px'}} onClick={handleSaveAuditoria}>
                                Guardar Auditoría
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Incidente */}
            {showIncidenteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Registrar Incidente</h3>
                            <MdClose style={{cursor: 'pointer'}} onClick={() => setShowIncidenteModal(false)} />
                        </div>
                        <div className="modal-body">
                            <div className="form-group mb-20">
                                <label style={{display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px'}}>Tipo de Incidente</label>
                                <input 
                                    type="text"
                                    placeholder="Ej. Fuga de químicos"
                                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1'}}
                                    value={newIncidente.tipoIncidente}
                                    onChange={(e) => setNewIncidente({...newIncidente, tipoIncidente: e.target.value})}
                                />
                            </div>
                            <div className="form-group mb-20">
                                <label style={{display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px'}}>Gravedad</label>
                                <select 
                                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1'}}
                                    value={newIncidente.gravedad}
                                    onChange={(e) => setNewIncidente({...newIncidente, gravedad: e.target.value})}
                                >
                                    <option value="BAJA">Baja</option>
                                    <option value="MEDIA">Media</option>
                                    <option value="ALTA">Alta</option>
                                </select>
                            </div>
                            <div className="form-group mb-20">
                                <label style={{display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px'}}>Descripción</label>
                                <textarea 
                                    rows="4" 
                                    style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical'}}
                                    value={newIncidente.descripcionInc}
                                    onChange={(e) => setNewIncidente({...newIncidente, descripcionInc: e.target.value})}
                                />
                            </div>
                            <button className="btn-primary" style={{width: '100%', padding: '10px'}} onClick={handleSaveIncidente}>
                                Guardar Incidente
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="banners-grid">
                <div className="banner-card banner-1">
                    <div className="banner-content">
                        <div className="banner-label">ZONA DE TRABAJO</div>
                        <h2 className="banner-title">Protocolo de Sanitización Activo</h2>
                    </div>
                </div>
                <div className="banner-card banner-2">
                    <div className="banner-content">
                        <div className="banner-label">ESTADÍSTICAS DE CALIDAD</div>
                        <h2 className="banner-title">98.4% Cumplimiento Normativo</h2>
                    </div>
                </div>
            </div>

            <button className="fab-help-btn">
                <MdHelpOutline size={24} />
            </button>
        </div>
    );
};

export default Auditoria;
