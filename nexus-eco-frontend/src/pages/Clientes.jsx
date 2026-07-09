import React, { useState, useEffect } from 'react';
import { MdCorporateFare, MdPerson, MdSave, MdInfoOutline, MdAdd, MdArrowBack } from 'react-icons/md';
import { getClientes, createCliente } from '../api/api';
import './Clientes.css';

const Clientes = () => {
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [cliente, setCliente] = useState({
        ruc: '',
        razonSocial: '',
        direccion: '',
        correo: '',
        estado: 'Activo',
        contactoNombre: '',
        contactoCargo: '',
        contactoTelefono: '',
        contactoCorreo: ''
    });

    useEffect(() => {
        if (view === 'list') {
            fetchClientes();
        }
    }, [view]);

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const response = await getClientes();
            setClientes(response.data);
        } catch (error) {
            console.error("Error al obtener clientes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const payload = {
            ruc: cliente.ruc,
            razonSocial: cliente.razonSocial,
            direccion: cliente.direccion,
            emailCliente: cliente.correo,
            estado: cliente.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO',
            contactos: [
                {
                    nombreCon: cliente.contactoNombre,
                    cargo: cliente.contactoCargo,
                    telefonoCon: cliente.contactoTelefono,
                    emailContacto: cliente.contactoCorreo
                }
            ]
        };

        try {
            await createCliente(payload);
            alert("Cliente guardado exitosamente");
            setView('list');
            // Reset form
            setCliente({
                ruc: '', razonSocial: '', direccion: '', correo: '', estado: 'Activo',
                contactoNombre: '', contactoCargo: '', contactoTelefono: '', contactoCorreo: ''
            });
        } catch (error) {
            console.error("Error al guardar cliente", error);
            alert("Ocurrió un error al guardar el cliente.");
        }
    };

    if (view === 'list') {
        return (
            <div className="clientes-page">
                <div className="breadcrumb">GESTIÓN / CLIENTES</div>
                
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Directorio de Clientes</h1>
                        <p className="page-subtitle">Visualiza y administra todos los clientes registrados en el sistema.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-nuevo" onClick={() => setView('form')}>
                            <MdAdd size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Nuevo Cliente
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="clientes-table">
                        <thead>
                            <tr>
                                <th>RUC</th>
                                <th>Razón Social</th>
                                <th>Contacto Principal</th>
                                <th>Teléfono</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                            ) : clientes.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay clientes registrados.</td></tr>
                            ) : (
                                clientes.map(c => (
                                    <tr key={c.idCliente}>
                                        <td>{c.ruc}</td>
                                        <td>{c.razonSocial}</td>
                                        <td>{c.contactos && c.contactos.length > 0 ? c.contactos[0].nombreCon : 'Sin contacto'}</td>
                                        <td>{c.contactos && c.contactos.length > 0 ? c.contactos[0].telefonoCon : '-'}</td>
                                        <td>
                                            <span className={`status-badge status-${c.estado?.toLowerCase()}`}>
                                                {c.estado}
                                            </span>
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
        <div className="clientes-page">
            <div className="breadcrumb">GESTIÓN / REGISTRO DE CLIENTE</div>
            
            <div className="page-header">
                <div>
                    <h1 className="page-title">Alta de Nuevo Cliente</h1>
                    <p className="page-subtitle">Complete la información requerida para dar de alta un nuevo cliente y su contacto principal.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-cancelar" onClick={() => setView('list')}>
                        <MdArrowBack size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Volver
                    </button>
                    <button className="btn-guardar" onClick={handleSave}>
                        <MdSave size={18} /> Guardar cliente
                    </button>
                </div>
            </div>

            <div className="form-card">
                <div className="card-badge">CLIENTE</div>
                <div className="card-header">
                    <MdCorporateFare size={22} className="card-icon" />
                    <h2>Información Corporativa</h2>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>RUC</label>
                        <input type="text" name="ruc" placeholder="20XXXXXXXXX" value={cliente.ruc} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Razón social</label>
                        <input type="text" name="razonSocial" placeholder="Nombre legal de la empresa" value={cliente.razonSocial} onChange={handleChange} />
                    </div>
                    <div className="form-group full-width">
                        <label>Dirección</label>
                        <input type="text" name="direccion" placeholder="Av. Principal 123, Distrito, Ciudad" value={cliente.direccion} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Correo del cliente</label>
                        <input type="email" name="correo" placeholder="administracion@empresa.com" value={cliente.correo} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Estado</label>
                        <select name="estado" value={cliente.estado} onChange={handleChange}>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-card">
                <div className="card-badge">CONTACTO_CLIENTE</div>
                <div className="card-header">
                    <MdPerson size={22} className="card-icon" />
                    <h2>Contacto Principal</h2>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Nombre del contacto</label>
                        <input type="text" name="contactoNombre" placeholder="Nombre completo" value={cliente.contactoNombre} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Cargo del contacto</label>
                        <input type="text" name="contactoCargo" placeholder="Ej: Gerente de Operaciones" value={cliente.contactoCargo} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Teléfono del contacto</label>
                        <input type="text" name="contactoTelefono" placeholder="+51 9XX XXX XXX" value={cliente.contactoTelefono} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Correo del contacto</label>
                        <input type="email" name="contactoCorreo" placeholder="contacto@empresa.com" value={cliente.contactoCorreo} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div className="info-alert">
                <MdInfoOutline size={24} className="alert-icon" />
                <p>Asegúrese de que el <strong>RUC</strong> sea válido para evitar errores en la facturación electrónica. Todos los campos son obligatorios para el cumplimiento normativo de saneamiento ambiental.</p>
            </div>
        </div>
    );
};

export default Clientes;
