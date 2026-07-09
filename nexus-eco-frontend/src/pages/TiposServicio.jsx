import React, { useState, useEffect } from 'react';
import { MdSettingsInputComponent, MdSave, MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md';
import { getTiposServicio, createTipoServicio, updateTipoServicio, deleteTipoServicio } from '../api/api';
import './TiposServicio.css';

const TiposServicio = () => {
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        nombreServicio: '',
        descripcionTs: '',
        precioBase: ''
    });

    useEffect(() => {
        fetchTipos();
    }, []);

    const fetchTipos = async () => {
        try {
            setLoading(true);
            const response = await getTiposServicio();
            setTipos(response.data);
        } catch (error) {
            console.error("Error al obtener tipos de servicio", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleOpenCreate = () => {
        setEditingId(null);
        setForm({ nombreServicio: '', descripcionTs: '', precioBase: '' });
        setShowModal(true);
    };

    const handleOpenEdit = (t) => {
        setEditingId(t.idTipoServicio);
        setForm({
            nombreServicio: t.nombreServicio || '',
            descripcionTs: t.descripcionTs || '',
            precioBase: t.precioBase || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de que desea eliminar este tipo de servicio?")) {
            try {
                await deleteTipoServicio(id);
                alert("Tipo de servicio eliminado exitosamente");
                fetchTipos();
            } catch (error) {
                console.error("Error al eliminar tipo de servicio", error);
                alert("No se pudo eliminar el tipo de servicio. Verifique que no esté asociado a solicitudes existentes.");
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.nombreServicio || !form.precioBase) {
            alert("Nombre del Servicio y Precio Base son requeridos.");
            return;
        }

        const payload = {
            idTipoServicio: editingId,
            nombreServicio: form.nombreServicio,
            descripcionTs: form.descripcionTs,
            precioBase: parseFloat(form.precioBase)
        };

        try {
            if (editingId) {
                await updateTipoServicio(editingId, payload);
                alert("Tipo de servicio actualizado exitosamente");
            } else {
                await createTipoServicio(payload);
                alert("Tipo de servicio guardado exitosamente");
            }
            setShowModal(false);
            fetchTipos();
        } catch (error) {
            console.error("Error al guardar tipo de servicio", error);
            alert("Ocurrió un error al guardar el tipo de servicio.");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    return (
        <div className="tipos-servicio-page">
            <div className="breadcrumb">ADMINISTRACIÓN / TIPOS DE SERVICIO</div>

            <div className="page-header">
                <div>
                    <h1 className="page-title">Catálogo de Servicios</h1>
                    <p className="page-subtitle">Administra los tipos de servicios ambientales, saneamiento y control de plagas que ofrece Econexus.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-nuevo" onClick={handleOpenCreate}>
                        <MdAdd size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Nuevo Servicio
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="tipos-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio Base</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                        ) : tipos.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay servicios registrados.</td></tr>
                        ) : (
                            tipos.map(t => (
                                <tr key={t.idTipoServicio}>
                                    <td>{t.idTipoServicio}</td>
                                    <td style={{ fontWeight: '600' }}>{t.nombreServicio}</td>
                                    <td>{t.descripcionTs || '-'}</td>
                                    <td style={{ color: '#0b7a75', fontWeight: '600' }}>{formatCurrency(t.precioBase)}</td>
                                    <td>
                                        <button className="btn-table-edit" onClick={() => handleOpenEdit(t)}>Editar</button>
                                        <button className="btn-table-delete" onClick={() => handleDelete(t.idTipoServicio)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
                            <button className="btn-close" onClick={() => setShowModal(false)}>
                                <MdClose size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Nombre del Servicio</label>
                                <input type="text" name="nombreServicio" value={form.nombreServicio} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea name="descripcionTs" value={form.descripcionTs} onChange={handleChange} rows="3" style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '4px',
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    outline: 'none',
                                    resize: 'vertical'
                                }} />
                            </div>
                            <div className="form-group">
                                <label>Precio Base (S/)</label>
                                <input type="number" name="precioBase" value={form.precioBase} onChange={handleChange} step="0.01" min="0" required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn-guardar"><MdSave size={16} /> Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TiposServicio;
