import React, { useState } from 'react';
import { MdCorporateFare, MdPerson, MdSave, MdInfoOutline } from 'react-icons/md';
import './Clientes.css';

const Clientes = () => {
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

    const handleChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        console.log("Guardando cliente", cliente);
        // Aquí se llamará a la API
    };

    return (
        <div className="clientes-page">
            <div className="breadcrumb">GESTIÓN / REGISTRO DE CLIENTE</div>
            
            <div className="page-header">
                <div>
                    <h1 className="page-title">Alta de Nuevo Cliente</h1>
                    <p className="page-subtitle">Complete la información requerida para dar de alta un nuevo cliente y su contacto principal.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-cancelar">Cancelar</button>
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
