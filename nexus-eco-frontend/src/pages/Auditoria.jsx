import React from 'react';
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
    MdHelpOutline
} from 'react-icons/md';
import './Auditoria.css';

const Auditoria = () => {
    return (
        <div className="auditoria-page">
            <div className="breadcrumb">
                SERVICIOS / <span className="breadcrumb-highlight">ORDEN_SERVICIO #OS-2024-089</span>
            </div>
            
            <div className="page-header">
                <h1 className="page-title">Auditoría y Cierre de Servicio</h1>
                <div className="header-actions">
                    <button className="btn-outline">
                        <MdOutlineChecklist size={18} /> Registrar auditoría
                    </button>
                    <button className="btn-outline">
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
                                <tr>
                                    <td>
                                        <div className="auditor-info">
                                            <div className="avatar green-bg">RA</div>
                                            <span className="auditor-name">Ricardo<br/>Alarcón</span>
                                        </div>
                                    </td>
                                    <td>24/05/2024</td>
                                    <td>
                                        <div className="rating">
                                            <MdStar className="star-filled" />
                                            <MdStar className="star-filled" />
                                            <MdStar className="star-filled" />
                                            <MdStar className="star-filled" />
                                            <MdStarBorder className="star-empty" />
                                            <span className="rating-score">4.0</span>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="obs-text">
                                            Limpieza profunda en ductos C-12 completada. Pequeñas manchas de óxido en rejilla exterior.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="auditor-info">
                                            <div className="avatar blue-bg">ML</div>
                                            <span className="auditor-name">Martha<br/>Lozano</span>
                                        </div>
                                    </td>
                                    <td>18/05/2024</td>
                                    <td>
                                        <div className="rating">
                                            <MdStar className="star-filled" />
                                            <MdStar className="star-filled" />
                                            <MdStar className="star-filled" />
                                            <MdStar className="star-filled" />
                                            <MdStar className="star-filled" />
                                            <span className="rating-score">5.0</span>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="obs-text">
                                            Excelente ejecución. Uso correcto de EPP por parte de todo el equipo de campo.
                                        </p>
                                    </td>
                                </tr>
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
                                <div className="informe-date">25 de Mayo, 2024 - 14:30</div>
                            </div>
                            <span className="badge-enviado">ENVIADO</span>
                        </div>
                        
                        <div className="pdf-box">
                            <MdOutlinePictureAsPdf size={32} className="pdf-icon" />
                            <div className="pdf-info">
                                <h4>INFORME_FINAL_OS89.pdf</h4>
                                <p>4.2 MB • FIRMADO DIGITALMENTE</p>
                            </div>
                            <MdFileDownload size={24} className="download-icon" />
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
                <div className="incidencia-card">
                    <div className="incidencia-header">
                        <span className="badge-critica">CRÍTICA</span>
                        <span className="incidencia-id">ID: INC-992</span>
                    </div>
                    <h3 className="incidencia-title">Derrame de Químico Clase B</h3>
                    <p className="incidencia-desc">Se detectó fuga en contenedor de amonio cuaternario durante el traslado a zona de...</p>
                    <div className="incidencia-seguimiento">
                        <div className="seguimiento-label">ÚLTIMO SEGUIMIENTO</div>
                        <p className="seguimiento-text">"Área acordonada y neutralización de PH completada."</p>
                    </div>
                    <div className="incidencia-footer">
                        <span className="status-pendiente"><span className="dot-red"></span> PENDIENTE</span>
                        <a href="#" className="link-gestionar">Gestionar <MdKeyboardArrowRight size={18} /></a>
                    </div>
                </div>

                <div className="incidencia-card">
                    <div className="incidencia-header">
                        <span className="badge-media">MEDIA</span>
                        <span className="incidencia-id">ID: INC-988</span>
                    </div>
                    <h3 className="incidencia-title">Fallo en Equipo UV-C</h3>
                    <p className="incidencia-desc">Lámpara de desinfección portátil presenta parpadeo constante, reduciendo...</p>
                    <div className="incidencia-seguimiento">
                        <div className="seguimiento-label">ÚLTIMO SEGUIMIENTO</div>
                        <p className="seguimiento-text">"Equipo enviado a taller. Se reemplaza por unidad de respaldo #04."</p>
                    </div>
                    <div className="incidencia-footer">
                        <span className="status-resuelta"><span className="dot-green"></span> RESUELTA</span>
                        <a href="#" className="link-gestionar">Gestionar <MdKeyboardArrowRight size={18} /></a>
                    </div>
                </div>

                <div className="incidencia-card dashed">
                    <div className="add-icon-wrapper">
                        <MdAddAlert size={24} />
                    </div>
                    <h3 className="incidencia-title text-center">Registrar Nueva Incidencia</h3>
                    <p className="incidencia-desc text-center">Documentar fallo operativo o desviación de protocolo de seguridad.</p>
                </div>
            </div>

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

            <footer className="page-footer">
                <div className="footer-left">© 2024 ECONEXUS SOLUTIONS S.A. | VERSIÓN 4.2.1-RELEASE</div>
                <div className="footer-right">
                    <span>POLÍTICA DE PRIVACIDAD</span>
                    <span>TÉRMINOS DE SERVICIO</span>
                    <span>BITÁCORA DEL SISTEMA</span>
                </div>
            </footer>
        </div>
    );
};

export default Auditoria;
