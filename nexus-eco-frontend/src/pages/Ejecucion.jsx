import React, { useState } from 'react';
import { MdClose, MdSave, MdCloudUpload, MdImage, MdPictureAsPdf, MdSubject, MdStorage, MdOpenInNew, MdVisibility } from 'react-icons/md';
import './Ejecucion.css';

const Ejecucion = () => {
    const [ejecucion, setEjecucion] = useState({
        planificacion: 'PLAN-2023-112: Desinsectación Zona Norte',
        fecha: '2023-10-27',
        resultado: 'Satisfactorio (Pass)',
        observaciones: ''
    });

    return (
        <div className="ejecucion-page">
            <div className="breadcrumb">
                <span className="badge-dark">EJECUCION_SERVICIO</span> ID: EXEC-2023-9842
            </div>
            
            <div className="page-header">
                <h1 className="page-title">Ejecución de Servicio</h1>
                <div className="header-actions">
                    <button className="btn-cancelar">
                        <MdClose size={16} /> Cancelar
                    </button>
                    <button className="btn-guardar">
                        <MdSave size={16} /> Guardar ejecución
                    </button>
                </div>
            </div>

            <div className="top-layout">
                <div className="form-card">
                    <h2 className="card-title">Evidencias del servicio</h2>
                    
                    <div className="form-group mb-16">
                        <label>Planificación (Reference)</label>
                        <select 
                            value={ejecucion.planificacion} 
                            onChange={(e) => setEjecucion({...ejecucion, planificacion: e.target.value})}
                        >
                            <option value="PLAN-2023-112: Desinsectación Zona Norte">PLAN-2023-112: Desinsectación Zona Norte</option>
                        </select>
                        <div className="reference-badges">
                            <span className="ref-badge"><strong>ORDEN_SERVICIO:</strong> #9822</span>
                            <span className="ref-badge"><strong>CLIENTE:</strong> LogisCorp S.A.</span>
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
                            <span className="badge-green-light">ACTIVE_SYNC</span>
                        </div>
                        <p className="upload-subtitle">Stored in MongoDB Infrastructure</p>
                    </div>

                    <div className="dropzone">
                        <MdCloudUpload size={32} className="dropzone-icon" />
                        <h3>Arrastra archivos aquí o haz clic</h3>
                        <p>JPG, PNG, PDF o Actas Firmadas (Max 10MB)</p>
                        <button className="btn-subir">Subir evidencia</button>
                    </div>

                    <div className="evidence-list">
                        <div className="evidence-item">
                            <div className="evidence-icon-wrapper blue-light">
                                <MdImage size={20} className="icon-blue" />
                            </div>
                            <div className="evidence-info">
                                <h4>Foto del servicio</h4>
                                <p>Pendiente de carga</p>
                            </div>
                        </div>

                        <div className="evidence-item">
                            <div className="evidence-icon-wrapper blue-light">
                                <MdPictureAsPdf size={20} className="icon-blue" />
                            </div>
                            <div className="evidence-info">
                                <h4>PDF o acta</h4>
                                <p>Pendiente de carga</p>
                            </div>
                        </div>

                        <div className="evidence-item">
                            <div className="evidence-icon-wrapper gray-light">
                                <MdSubject size={20} className="icon-gray" />
                            </div>
                            <div className="evidence-info">
                                <h4>Observaciones</h4>
                                <p>Sin comentarios adjuntos</p>
                            </div>
                        </div>
                    </div>

                    <div className="upload-footer">
                        <span className="storage-info">Total Almacenado: 4.2 MB</span>
                        <span className="db-info">
                            <MdStorage size={14} /> MongoDB Atlas Cloud
                        </span>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <div className="table-header">
                    <h2 className="card-title">Ejecuciones recientes en esta zona</h2>
                    <a href="#" className="link-historico">
                        Ver histórico completo <MdOpenInNew size={14} />
                    </a>
                </div>
                <table className="recent-table">
                    <thead>
                        <tr>
                            <th>FECHA</th>
                            <th>TÉCNICO</th>
                            <th>RESULTADO</th>
                            <th>EVIDENCIAS</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>15 Oct 2023</td>
                            <td>Carlos Méndez</td>
                            <td>
                                <span className="status-label">
                                    <span className="dot-green"></span> Completado
                                </span>
                            </td>
                            <td>
                                <div className="evidence-thumbnails">
                                    <div className="thumb gray"></div>
                                    <div className="thumb dark"></div>
                                    <div className="thumb-count">+2</div>
                                </div>
                            </td>
                            <td>
                                <MdVisibility size={20} className="action-icon" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Ejecucion;
