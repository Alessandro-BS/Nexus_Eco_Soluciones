import React, { useState, useEffect } from 'react';
import { MdPerson, MdSave, MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md';
import { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from '../api/api';
import './Empleados.css';

const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        nombreEmp: '',
        apellidoEmp: '',
        cargoEmp: '',
        area: ''
    });

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const fetchEmpleados = async () => {
        try {
            setLoading(true);
            const response = await getEmpleados();
            setEmpleados(response.data);
        } catch (error) {
            console.error("Error al obtener empleados", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleOpenCreate = () => {
        setEditingId(null);
        setForm({ nombreEmp: '', apellidoEmp: '', cargoEmp: '', area: '' });
        setShowModal(true);
    };

    const handleOpenEdit = (emp) => {
        setEditingId(emp.idEmpleado);
        setForm({
            nombreEmp: emp.nombreEmp || '',
            apellidoEmp: emp.apellidoEmp || '',
            cargoEmp: emp.cargoEmp || '',
            area: emp.area || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de que desea eliminar este empleado?")) {
            try {
                await deleteEmpleado(id);
                alert("Empleado eliminado exitosamente");
                fetchEmpleados();
            } catch (error) {
                console.error("Error al eliminar empleado", error);
                alert("No se pudo eliminar el empleado. Verifique que no tenga solicitudes asociadas.");
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.nombreEmp || !form.apellidoEmp) {
            alert("Nombre y Apellido son requeridos.");
            return;
        }

        const payload = {
            idEmpleado: editingId,
            nombreEmp: form.nombreEmp,
            apellidoEmp: form.apellidoEmp,
            cargoEmp: form.cargoEmp,
            area: form.area
        };

        try {
            if (editingId) {
                await updateEmpleado(editingId, payload);
                alert("Empleado actualizado exitosamente");
            } else {
                await createEmpleado(payload);
                alert("Empleado guardado exitosamente");
            }
            setShowModal(false);
            fetchEmpleados();
        } catch (error) {
            console.error("Error al guardar empleado", error);
            alert("Ocurrió un error al guardar el empleado.");
        }
    };

    return (
        <div className="empleados-page">
            <div className="breadcrumb">ADMINISTRACIÓN / EMPLEADOS</div>

            <div className="page-header">
                <div>
                    <h1 className="page-title">Mantenimiento de Empleados</h1>
                    <p className="page-subtitle">Administra los inspectores, coordinadores y personal administrativo del sistema.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-nuevo" onClick={handleOpenCreate}>
                        <MdAdd size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Nuevo Empleado
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="empleados-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Cargo</th>
                            <th>Área</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                        ) : empleados.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hay empleados registrados.</td></tr>
                        ) : (
                            empleados.map(emp => (
                                <tr key={emp.idEmpleado}>
                                    <td>{emp.idEmpleado}</td>
                                    <td>{emp.nombreEmp}</td>
                                    <td>{emp.apellidoEmp}</td>
                                    <td>{emp.cargoEmp || '-'}</td>
                                    <td>{emp.area || '-'}</td>
                                    <td>
                                        <button className="btn-table-edit" onClick={() => handleOpenEdit(emp)}>Editar</button>
                                        <button className="btn-table-delete" onClick={() => handleDelete(emp.idEmpleado)}>Eliminar</button>
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
                            <h2>{editingId ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
                            <button className="btn-close" onClick={() => setShowModal(false)}>
                                <MdClose size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input type="text" name="nombreEmp" value={form.nombreEmp} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Apellido</label>
                                <input type="text" name="apellidoEmp" value={form.apellidoEmp} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Cargo</label>
                                <input type="text" name="cargoEmp" value={form.cargoEmp} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Área</label>
                                <input type="text" name="area" value={form.area} onChange={handleChange} />
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

export default Empleados;
