import React, { useState, useEffect } from 'react';
import { MdStar, MdStarBorder, MdOpenInNew, MdOutlineAssignment, MdDeleteOutline, MdRefresh } from 'react-icons/md';
import { getEncuestasSatisfaccion, deleteEncuestaSatisfaccion } from '../api/api';
import './Satisfaccion.css';

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScmxpUKav-c05jhL8LISTIiYdHESDE4MVI0MRv6vIVHR_W72Q/viewform?usp=sharing&ouid=102275724767380997873";

const Satisfaccion = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters state
    const [searchQuery, setSearchQuery] = useState('');
    const [qualityFilter, setQualityFilter] = useState('ALL');
    const [professionalismFilter, setProfessionalismFilter] = useState('ALL');

    useEffect(() => {
        fetchEncuestas();
    }, []);

    const fetchEncuestas = async () => {
        setLoading(true);
        try {
            const res = await getEncuestasSatisfaccion();
            const sortedData = [...res.data].sort((a, b) => new Date(b.fechaRespuesta) - new Date(a.fechaRespuesta));
            setEncuestas(sortedData);
        } catch (error) {
            console.error("Error fetching encuestas", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de que desea eliminar esta respuesta de encuesta de MongoDB?")) {
            try {
                await deleteEncuestaSatisfaccion(id);
                alert("Respuesta eliminada exitosamente");
                fetchEncuestas();
            } catch (error) {
                console.error("Error al eliminar encuesta", error);
            }
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<MdStar key={i} className="star-filled" style={{ color: '#ffb400' }} />);
            } else {
                stars.push(<MdStarBorder key={i} className="star-empty" style={{ color: '#cbd5e1' }} />);
            }
        }
        return stars;
    };

    const filteredEncuestas = encuestas.filter(enc => {
        const clientName = (enc.nombreCliente || `Cliente ID: ${enc.idCliente || 'N/A'}`).toLowerCase();
        const service = (enc.tipoServicioRecibido || '').toLowerCase();
        const comments = (enc.sugerenciasComentarios || enc.comentarios || '').toLowerCase();
        
        const matchesSearch = clientName.includes(searchQuery.toLowerCase()) || 
                              service.includes(searchQuery.toLowerCase()) || 
                              comments.includes(searchQuery.toLowerCase());
                              
        const quality = enc.calidadGeneral || enc.calidadServicio;
        const matchesQuality = qualityFilter === 'ALL' || (quality && quality.toString() === qualityFilter);
        
        const professionalism = enc.amabilidadProfesionalismo || enc.profesionalismo;
        const matchesProf = professionalismFilter === 'ALL' || (professionalism && professionalism.toString() === professionalismFilter);
        
        return matchesSearch && matchesQuality && matchesProf;
    });

    const handleClearFilters = () => {
        setSearchQuery('');
        setQualityFilter('ALL');
        setProfessionalismFilter('ALL');
    };

    return (
        <div className="satisfaccion-page">
            <div className="breadcrumb">OPERATIVO / SATISFACCIÓN (MONGODB)</div>

            <div className="page-header">
                <div>
                    <h1 className="page-title">Encuestas de Satisfacción</h1>
                    <p className="page-subtitle">Sincronización externa con Google Forms. Los datos se almacenan en MongoDB.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-refresh" onClick={fetchEncuestas} title="Refrescar">
                        <MdRefresh size={20} />
                    </button>
                    <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn-form-link">
                        <MdOpenInNew size={18} style={{ marginRight: '6px' }} /> Abrir Google Forms
                    </a>
                </div>
            </div>

            <div className="google-forms-info-card">
                <div className="info-icon-wrapper">
                    <MdOutlineAssignment size={28} />
                </div>
                <div className="info-text">
                    <h3>Integración con Google Forms</h3>
                    <p>La encuesta de satisfacción es externa. Los clientes ingresan al enlace de Google Forms, y al responder, un trigger de Google Apps Script envía los datos directamente al backend, el cual los guarda en <strong>MongoDB</strong> (colección: <code>encuestas_satisfaccion</code>).</p>
                    <p style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                        <strong>Webhook endpoint:</strong> <code>POST /api/encuesta-satisfaccions/webhook</code>
                    </p>
                </div>
            </div>

            <div className="filters-bar">
                <div className="filter-group search">
                    <span className="filter-label">Buscar Encuesta</span>
                    <input 
                        type="text" 
                        className="filter-input" 
                        placeholder="Buscar por cliente, servicio o comentarios..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <span className="filter-label">Calidad</span>
                    <select 
                        className="filter-select" 
                        value={qualityFilter}
                        onChange={(e) => setQualityFilter(e.target.value)}
                    >
                        <option value="ALL">Cualquier Calificación</option>
                        <option value="5">5 ⭐⭐⭐⭐⭐</option>
                        <option value="4">4 ⭐⭐⭐⭐</option>
                        <option value="3">3 ⭐⭐⭐</option>
                        <option value="2">2 ⭐⭐</option>
                        <option value="1">1 ⭐</option>
                    </select>
                </div>
                <div className="filter-group">
                    <span className="filter-label">Amabilidad/Profesionalismo</span>
                    <select 
                        className="filter-select" 
                        value={professionalismFilter}
                        onChange={(e) => setProfessionalismFilter(e.target.value)}
                    >
                        <option value="ALL">Cualquier Calificación</option>
                        <option value="5">5 ⭐⭐⭐⭐⭐</option>
                        <option value="4">4 ⭐⭐⭐⭐</option>
                        <option value="3">3 ⭐⭐⭐</option>
                        <option value="2">2 ⭐⭐</option>
                        <option value="1">1 ⭐</option>
                    </select>
                </div>
                {(searchQuery || qualityFilter !== 'ALL' || professionalismFilter !== 'ALL') && (
                    <div className="filter-group action">
                        <button className="btn-filter-clear" onClick={handleClearFilters}>
                            Limpiar
                        </button>
                    </div>
                )}
            </div>

            <div className="table-container">
                <table className="satisfaccion-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Servicio Recibido</th>
                            <th>Calidad</th>
                            <th>Profesionalismo</th>
                            <th>Sugerencias / Comentarios</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Cargando datos de MongoDB...</td></tr>
                        ) : filteredEncuestas.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No se encontraron encuestas con los filtros aplicados.</td></tr>
                        ) : (
                            filteredEncuestas.map(enc => (
                                <tr key={enc.id}>
                                    <td style={{ fontSize: '13px' }}>
                                        {enc.fechaRespuesta ? new Date(enc.fechaRespuesta).toLocaleString() : '-'}
                                    </td>
                                    <td style={{ fontWeight: '600' }}>
                                        {enc.nombreCliente || `Cliente ID: ${enc.idCliente || 'N/A'}`}
                                    </td>
                                    <td>{enc.tipoServicioRecibido || '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {renderStars(enc.calidadGeneral || enc.calidadServicio)}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {renderStars(enc.amabilidadProfesionalismo || enc.profesionalismo)}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '13px', fontStyle: 'italic', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={enc.sugerenciasComentarios || enc.comentarios}>
                                        {enc.sugerenciasComentarios || enc.comentarios || '-'}
                                    </td>
                                    <td>
                                        <button 
                                            className="btn-delete-survey" 
                                            onClick={() => handleDelete(enc.id)}
                                            title="Eliminar de MongoDB"
                                        >
                                            <MdDeleteOutline size={18} />
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
};

export default Satisfaccion;
