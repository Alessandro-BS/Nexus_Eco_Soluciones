import React, { useState } from 'react';
import { MdClose, MdAssignment, MdSearch, MdEvent, MdDeleteOutline, MdHistory, MdLocalOffer, MdPrint } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import './Servicios.css';

const Servicios = () => {
    const [solicitud, setSolicitud] = useState({
        cliente: '',
        fecha: '2023-10-27',
        empleado: 'Carlos Alberto Gómez',
        estado: 'EN_PROCESO',
        descripcion: ''
    });

    const [servicios, setServicios] = useState([
        { id: 1, nombre: 'Control de Plagas', tipo: 'TIPO_SERVICIO_P04', cantidad: 1, precio: 125000 },
        { id: 2, nombre: 'Limpieza de Tanques', tipo: 'TIPO_SERVICIO_L01', cantidad: 2, precio: 45000 }
    ]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
    };

    const subtotal = servicios.reduce((acc, curr) => acc + (curr.cantidad * curr.precio), 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    return (
        <div className="servicios-page">
            <div className="breadcrumb">
                <span className="badge-dark">SOLICITUD_SERVICIO</span> / NUEVO_REGISTRO
            </div>
            
            <div className="page-header">
                <div>
                    <h1 className="page-title">Solicitud de Servicio</h1>
                    <p className="page-subtitle">Cree una nueva solicitud y configure los detalles de la orden operativa.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-cancelar">
                        <MdClose size={16} /> Cancelar
                    </button>
                    <button className="btn-generar">
                        <MdAssignment size={16} /> Generar orden de servicio
                    </button>
                </div>
            </div>

            <div className="content-layout">
                <div className="main-column">
                    <div className="form-card">
                        <div className="card-header">
                            <MdAssignment size={22} className="card-icon" />
                            <h2>Información de la Solicitud</h2>
                        </div>
                        
                        <div className="form-group mb-20">
                            <label>Cliente (SOLICITUD_SERVICIO.cliente_id)</label>
                            <div className="search-input-wrapper">
                                <MdSearch size={20} className="search-icon" />
                                <input type="text" placeholder="Buscar por nombre, NIT o razón social..." />
                                <span className="input-badge">CLIENTE</span>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Fecha de solicitud</label>
                                <div className="date-input-wrapper">
                                    <input type="date" value={solicitud.fecha} onChange={(e) => setSolicitud({...solicitud, fecha: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Empleado que atiende</label>
                                <select value={solicitud.empleado} onChange={(e) => setSolicitud({...solicitud, empleado: e.target.value})}>
                                    <option value="Carlos Alberto Gómez">Carlos Alberto Gómez</option>
                                    <option value="Ana María López">Ana María López</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group mb-20">
                            <label>Estado de solicitud</label>
                            <div className="estado-input">
                                <span className="status-dot"></span> EN_PROCESO
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descripción del servicio solicitado</label>
                            <textarea 
                                placeholder="Detalle los requerimientos especificos del cliente..." 
                                rows="3"
                                value={solicitud.descripcion}
                                onChange={(e) => setSolicitud({...solicitud, descripcion: e.target.value})}
                            ></textarea>
                        </div>
                    </div>

                    <div className="table-card">
                        <div className="table-header-bg"></div>
                        <table className="servicios-table">
                            <thead>
                                <tr>
                                    <th>Servicio</th>
                                    <th>Cantidad</th>
                                    <th>Precio unitario</th>
                                    <th>Subtotal</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicios.map((srv) => (
                                    <tr key={srv.id}>
                                        <td>
                                            <div className="srv-input-wrapper">
                                                <input type="text" defaultValue={srv.nombre} />
                                                <span className="srv-badge">{srv.tipo}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <input type="number" defaultValue={srv.cantidad} className="text-center" />
                                        </td>
                                        <td>
                                            <div className="price-input">
                                                <span>$</span>
                                                <input type="number" defaultValue={srv.precio} />
                                            </div>
                                        </td>
                                        <td className="subtotal-cell">
                                            {formatCurrency(srv.cantidad * srv.precio)}
                                        </td>
                                        <td className="action-cell">
                                            <MdDeleteOutline size={22} className="delete-icon" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="side-column">
                    <div className="totals-card">
                        <div className="totals-header">
                            <MdAssignment size={20} /> Resumen de Totales
                        </div>
                        <div className="divider"></div>
                        <div className="totals-row">
                            <span>Subtotal de Servicios</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="totals-row">
                            <span>IVA (19%)</span>
                            <span>{formatCurrency(iva)}</span>
                        </div>
                        <div className="totals-final">
                            <span className="final-label">MONTO TOTAL A PAGAR</span>
                            <span className="final-amount">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    <div className="stats-card">
                        <div className="stats-header">ESTADÍSTICAS DEL CLIENTE</div>
                        
                        <div className="stat-item">
                            <div className="stat-icon-wrapper green-bg">
                                <MdHistory size={20} />
                            </div>
                            <div>
                                <div className="stat-label">Último Servicio</div>
                                <div className="stat-value">15 Sep 2023</div>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon-wrapper blue-bg">
                                <MdLocalOffer size={20} />
                            </div>
                            <div>
                                <div className="stat-label">Frecuencia</div>
                                <div className="stat-value">Mensual (VIP)</div>
                            </div>
                        </div>

                        <div className="stat-quote">
                            "Cliente requiere acceso por zona de carga posterior después de las 18:00."
                        </div>
                    </div>

                    <div className="print-card">
                        <MdPrint size={40} className="print-icon" />
                        <p>La vista previa de la orden estará disponible al guardar los cambios.</p>
                    </div>
                </div>
            </div>

            <button className="fab-btn">
                <FaPlus size={20} />
            </button>

            <footer className="page-footer">
                <div className="footer-left">© 2023 ECONEXUS SOFTWARE DE GESTIÓN AMBIENTAL</div>
                <div className="footer-right">
                    <span>POLÍTICA DE PRIVACIDAD</span>
                    <span>TÉRMINOS DE OPERACIÓN</span>
                    <span>LOGS DEL SISTEMA</span>
                </div>
            </footer>
        </div>
    );
};

export default Servicios;
