import React, { useState, useEffect } from 'react';
import { MdListAlt, MdSave, MdAdd, MdArrowBack } from 'react-icons/md';
import { getOrdenesTrabajo, createOrdenTrabajo, updateOrdenTrabajo, deleteOrdenTrabajo, getOrdenes } from '../api/api';
import './OrdenesTrabajo.css';

const formatOS = (id) => `OS-2026-${String(id).padStart(4, '0')}`;
const formatOT = (id) => `OT-2026-${String(id).padStart(4, '0')}`;

const OrdenesTrabajo = () => {
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [ordenesTrabajo, setOrdenesTrabajo] = useState([]);
    const [ordenesServicio, setOrdenesServicio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Filters state
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const [form, setForm] = useState({
        idOrdenServicio: '',
        descripcionOt: '',
        prioridad: 'MEDIA',
        estadoOt: 'PENDIENTE'
    });

    useEffect(() => {
        if (view === 'list') {
            fetchOrdenesTrabajo();
        } else {
            fetchOrdenesServicio();
        }
    }, [view]);

    const fetchOrdenesTrabajo = async () => {
        try {
            setLoading(true);
            const response = await getOrdenesTrabajo();
            setOrdenesTrabajo(response.data);
        } catch (error) {
            console.error("Error al obtener órdenes de trabajo", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrdenesServicio = async () => {
        try {
            const response = await getOrdenes();
            setOrdenesServicio(response.data);
            if (response.data.length > 0 && !form.idOrdenServicio) {
                setForm(f => ({ ...f, idOrdenServicio: response.data[0].idOrdenServicio.toString() }));
            }
        } catch (error) {
            console.error("Error al obtener órdenes de servicio", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleNew = () => {
        setEditingId(null);
        setForm({
            idOrdenServicio: ordenesServicio.length > 0 ? ordenesServicio[0].idOrdenServicio.toString() : '',
            descripcionOt: '',
            prioridad: 'MEDIA',
            estadoOt: 'PENDIENTE'
        });
        setView('form');
    };

    const handleEdit = (ot) => {
        setEditingId(ot.idOrdenTrabajo);
        setForm({
            idOrdenServicio: ot.ordenServicio ? ot.ordenServicio.idOrdenServicio.toString() : '',
            descripcionOt: ot.descripcionOt || '',
            prioridad: ot.prioridad || 'MEDIA',
            estadoOt: ot.estadoOt || 'PENDIENTE'
        });
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de que desea eliminar esta orden de trabajo?")) {
            try {
                await deleteOrdenTrabajo(id);
                alert("Orden de trabajo eliminada exitosamente");
                fetchOrdenesTrabajo();
            } catch (error) {
                console.error("Error al eliminar orden de trabajo", error);
                alert("No se pudo eliminar la orden de trabajo. Verifique que no esté planificada.");
            }
        }
    };

    const handleSave = async () => {
        if (!form.idOrdenServicio || !form.descripcionOt) {
            alert("Orden de Servicio y Descripción son requeridos.");
            return;
        }

        const payload = {
            idOrdenTrabajo: editingId,
            descripcionOt: form.descripcionOt,
            prioridad: form.prioridad,
            estadoOt: form.estadoOt,
            ordenServicio: {
                idOrdenServicio: parseInt(form.idOrdenServicio)
            }
        };

        try {
            if (editingId) {
                await updateOrdenTrabajo(editingId, payload);
                alert("Orden de trabajo actualizada exitosamente");
            } else {
                await createOrdenTrabajo(payload);
                alert("Orden de trabajo guardada exitosamente");
            }
            setView('list');
        } catch (error) {
            console.error("Error al guardar orden de trabajo", error);
            alert("Ocurrió un error al guardar la orden de trabajo.");
        }
    };

    if (view === 'list') {
        const filteredOTs = ordenesTrabajo.filter(ot => {
            const matchesSearch = (ot.descripcionOt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  formatOT(ot.idOrdenTrabajo).toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  (ot.ordenServicio ? formatOS(ot.ordenServicio.idOrdenServicio).toLowerCase().includes(searchQuery.toLowerCase()) : false);
            const matchesPriority = priorityFilter === 'ALL' || ot.prioridad === priorityFilter;
            const matchesStatus = statusFilter === 'ALL' || ot.estadoOt === statusFilter;
            
            return matchesSearch && matchesPriority && matchesStatus;
        });

        const handleClearFilters = () => {
            setSearchQuery('');
            setPriorityFilter('ALL');
            setStatusFilter('ALL');
        };

        return (
            <div className="ot-page">
                <div className="breadcrumb">OPERATIVO / ÓRDENES DE TRABAJO</div>
                
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Órdenes de Trabajo (OT)</h1>
                        <p className="page-subtitle">Genera y asigna las tareas operativas de saneamiento en base a los contratos y órdenes de servicio aprobadas.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-nuevo" onClick={handleNew}>
                            <MdAdd size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Nueva OT
                        </button>
                    </div>
                </div>

                <div className="filters-bar">
                    <div className="filter-group search">
                        <span className="filter-label">Buscar Orden de Trabajo</span>
                        <input 
                            type="text" 
                            className="filter-input" 
                            placeholder="Buscar por descripción, OT o OS..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <span className="filter-label">Prioridad</span>
                        <select 
                            className="filter-select" 
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="ALL">Todas las prioridades</option>
                            <option value="BAJA">BAJA</option>
                            <option value="MEDIA">MEDIA</option>
                            <option value="ALTA">ALTA</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <span className="filter-label">Estado</span>
                        <select 
                            className="filter-select" 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Todos los estados</option>
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="EN_PROCESO">EN PROCESO</option>
                            <option value="COMPLETADO">COMPLETADO</option>
                        </select>
                    </div>
                    {(searchQuery || priorityFilter !== 'ALL' || statusFilter !== 'ALL') && (
                        <div className="filter-group action">
                            <button className="btn-filter-clear" onClick={handleClearFilters}>
                                Limpiar Filtros
                            </button>
                        </div>
                    )}
                </div>

                <div className="table-container">
                    <table className="ot-table">
                        <thead>
                            <tr>
                                <th>Código OT</th>
                                <th>Orden Servicio</th>
                                <th>Descripción</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                            ) : filteredOTs.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No se encontraron órdenes de trabajo con los filtros aplicados.</td></tr>
                            ) : (
                                filteredOTs.map(ot => (
                                    <tr key={ot.idOrdenTrabajo}>
                                        <td style={{ fontWeight: '600' }}>{formatOT(ot.idOrdenTrabajo)}</td>
                                        <td>{ot.ordenServicio ? formatOS(ot.ordenServicio.idOrdenServicio) : '-'}</td>
                                        <td>{ot.descripcionOt}</td>
                                        <td>
                                            <span className={`priority-badge priority-${ot.prioridad?.toLowerCase()}`}>
                                                {ot.prioridad}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${ot.estadoOt?.toLowerCase().replace('_', '')}`}>
                                                {ot.estadoOt}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-table-edit" onClick={() => handleEdit(ot)}>Editar</button>
                                            <button className="btn-table-delete" onClick={() => handleDelete(ot.idOrdenTrabajo)}>Eliminar</button>
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
        <div className="ot-page">
            <div className="breadcrumb">OPERATIVO / DETALLE ORDEN DE TRABAJO</div>

            <div className="page-header">
                <div>
                    <h1 className="page-title">{editingId ? 'Editar Orden de Trabajo' : 'Generar Orden de Trabajo'}</h1>
                    <p className="page-subtitle">Configure los detalles específicos para la realización de los trabajos contratados.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-cancelar" onClick={() => setView('list')}>
                        <MdArrowBack size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Volver
                    </button>
                    <button className="btn-guardar" onClick={handleSave}>
                        <MdSave size={18} /> Guardar Orden
                    </button>
                </div>
            </div>

            <div className="form-card">
                <div className="card-badge">ORDEN_TRABAJO</div>
                <div className="card-header">
                    <MdListAlt size={22} className="card-icon" />
                    <h2>Detalles de la Tarea</h2>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Orden de Servicio Asociada</label>
                        <select name="idOrdenServicio" value={form.idOrdenServicio} onChange={handleChange} required>
                            <option value="">-- Seleccionar Orden Servicio --</option>
                            {ordenesServicio.map(os => (
                                <option key={os.idOrdenServicio} value={os.idOrdenServicio}>
                                    {formatOS(os.idOrdenServicio)} - {os.solicitudServicio?.cliente?.razonSocial || 'Cliente'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Prioridad</label>
                        <select name="prioridad" value={form.prioridad} onChange={handleChange}>
                            <option value="BAJA">BAJA</option>
                            <option value="MEDIA">MEDIA</option>
                            <option value="ALTA">ALTA</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Estado</label>
                        <select name="estadoOt" value={form.estadoOt} onChange={handleChange}>
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="EN_PROCESO">EN PROCESO</option>
                            <option value="COMPLETADO">COMPLETADO</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Descripción de la Tarea</label>
                        <textarea name="descripcionOt" value={form.descripcionOt} onChange={handleChange} placeholder="Detallar tareas a realizar..." rows="5" style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            fontFamily: 'inherit',
                            fontSize: '14px',
                            outline: 'none',
                            resize: 'vertical'
                        }} required />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdenesTrabajo;
