import React, { useState, useEffect } from 'react';
import { MdClose, MdAssignment, MdSearch, MdEvent, MdDeleteOutline, MdHistory, MdLocalOffer, MdPrint, MdAdd, MdArrowBack } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { getClientes, getEmpleados, getTiposServicio, getOrdenes, createSolicitud, createOrdenServicio } from '../api/api';
import './Servicios.css';

const Servicios = () => {
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [ordenes, setOrdenes] = useState([]);
    
    // Dropdown Data
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [tiposServicio, setTiposServicio] = useState([]);
    
    const [loading, setLoading] = useState(false);

    // Form State
    const [solicitud, setSolicitud] = useState({
        idCliente: '',
        fecha: new Date().toISOString().split('T')[0],
        idEmpleado: '',
        estado: 'EN_PROCESO',
        descripcion: ''
    });

    const [servicios, setServicios] = useState([]); // Selected services
    const [selectedTipo, setSelectedTipo] = useState('');
    const [cantidadSelected, setCantidadSelected] = useState(1);

    useEffect(() => {
        if (view === 'list') {
            fetchOrdenes();
        } else {
            fetchFormData();
        }
    }, [view]);

    const fetchOrdenes = async () => {
        try {
            setLoading(true);
            const res = await getOrdenes();
            setOrdenes(res.data);
        } catch (error) {
            console.error("Error fetching ordenes", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFormData = async () => {
        try {
            const [resClientes, resEmpleados, resTipos] = await Promise.all([
                getClientes(),
                getEmpleados(),
                getTiposServicio()
            ]);
            setClientes(resClientes.data);
            setEmpleados(resEmpleados.data);
            setTiposServicio(resTipos.data);
            
            // Set defaults if available
            if (resClientes.data.length > 0) setSolicitud(s => ({ ...s, idCliente: resClientes.data[0].idCliente }));
            if (resEmpleados.data.length > 0) setSolicitud(s => ({ ...s, idEmpleado: resEmpleados.data[0].idEmpleado }));
            if (resTipos.data.length > 0) setSelectedTipo(resTipos.data[0].idTipoServicio);
            
        } catch (error) {
            console.error("Error fetching form data", error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const handleAddServicio = () => {
        const tipo = tiposServicio.find(t => t.idTipoServicio.toString() === selectedTipo.toString());
        if (tipo && cantidadSelected > 0) {
            setServicios([...servicios, {
                idTipoServicio: tipo.idTipoServicio,
                nombre: tipo.nombreServicio,
                cantidad: cantidadSelected,
                precio: tipo.precioBase,
                subtotal: cantidadSelected * tipo.precioBase
            }]);
            setCantidadSelected(1);
        }
    };

    const handleRemoveServicio = (index) => {
        const newSrv = [...servicios];
        newSrv.splice(index, 1);
        setServicios(newSrv);
    };

    const subtotal = servicios.reduce((acc, curr) => acc + curr.subtotal, 0);
    const iva = subtotal * 0.18;
    const total = subtotal + iva;

    const handleGenerarOrden = async () => {
        if (!solicitud.idCliente || !solicitud.idEmpleado || servicios.length === 0) {
            alert("Debe seleccionar un cliente, un empleado y agregar al menos un servicio.");
            return;
        }

        try {
            // 1. Create Solicitud
            const solPayload = {
                fechaSolicitud: new Date(solicitud.fecha).toISOString(),
                descripcionSol: solicitud.descripcion,
                estadoSol: 'PENDIENTE',
                cliente: { idCliente: solicitud.idCliente },
                empleado: { idEmpleado: solicitud.idEmpleado }
            };
            
            const solRes = await createSolicitud(solPayload);
            const newSolicitudId = solRes.data.idSolicitudServicio;

            // 2. Create Orden
            const ordPayload = {
                fechaOrden: new Date().toISOString(),
                estadoOrden: solicitud.estado,
                montoTotal: total,
                solicitudServicio: { idSolicitudServicio: newSolicitudId },
                detalles: servicios.map(s => ({
                    cantidad: s.cantidad,
                    precioUnitario: s.precio,
                    subtotal: s.subtotal,
                    tipoServicio: { idTipoServicio: s.idTipoServicio }
                }))
            };

            await createOrdenServicio(ordPayload);
            alert("Orden generada exitosamente!");
            
            // Reset and go back
            setServicios([]);
            setSolicitud({ ...solicitud, descripcion: '' });
            setView('list');
            
        } catch (error) {
            console.error("Error al generar la orden", error);
            alert("Ocurrió un error al generar la orden de servicio.");
        }
    };

    if (view === 'list') {
        return (
            <div className="servicios-page">
                <div className="breadcrumb">GESTIÓN / SERVICIOS</div>
                
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Historial de Órdenes</h1>
                        <p className="page-subtitle">Visualiza y administra las solicitudes y órdenes de servicio.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-nuevo" onClick={() => setView('form')}>
                            <MdAdd size={18} /> Nueva Solicitud
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="main-table">
                        <thead>
                            <tr>
                                <th>ID Orden</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Monto Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                            ) : ordenes.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay órdenes registradas.</td></tr>
                            ) : (
                                ordenes.map(ord => (
                                    <tr key={ord.idOrdenServicio}>
                                        <td># {ord.idOrdenServicio}</td>
                                        <td>{new Date(ord.fechaOrden).toLocaleDateString()}</td>
                                        <td>{ord.solicitudServicio?.cliente?.razonSocial || 'Desconocido'}</td>
                                        <td>{formatCurrency(ord.montoTotal)}</td>
                                        <td>
                                            <span className={`status-badge status-${ord.estadoOrden?.toLowerCase()}`}>
                                                {ord.estadoOrden?.replace('_', ' ')}
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
                    <button className="btn-cancelar" onClick={() => setView('list')}>
                        <MdArrowBack size={16} /> Volver
                    </button>
                    <button className="btn-generar" onClick={handleGenerarOrden}>
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
                            <label>Cliente</label>
                            <select value={solicitud.idCliente} onChange={(e) => setSolicitud({...solicitud, idCliente: e.target.value})}>
                                {clientes.map(c => (
                                    <option key={c.idCliente} value={c.idCliente}>{c.razonSocial} - {c.ruc}</option>
                                ))}
                            </select>
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
                                <select value={solicitud.idEmpleado} onChange={(e) => setSolicitud({...solicitud, idEmpleado: e.target.value})}>
                                    {empleados.map(emp => (
                                        <option key={emp.idEmpleado} value={emp.idEmpleado}>{emp.nombreEmp} {emp.apellidoEmp}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group mb-20">
                            <label>Estado de solicitud</label>
                            <div className="estado-input">
                                <span className="status-dot"></span> EN PROCESO
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

                    <div className="form-card">
                        <div className="card-header">
                            <MdLocalOffer size={22} className="card-icon" />
                            <h2>Agregar Servicios</h2>
                        </div>
                        <div className="form-grid" style={{alignItems: 'end'}}>
                            <div className="form-group">
                                <label>Tipo de Servicio</label>
                                <select value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value)}>
                                    {tiposServicio.map(ts => (
                                        <option key={ts.idTipoServicio} value={ts.idTipoServicio}>{ts.nombreServicio} - {formatCurrency(ts.precioBase)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{display: 'flex', gap: '10px'}}>
                                <div style={{flex: 1}}>
                                    <label>Cantidad</label>
                                    <input type="number" min="1" value={cantidadSelected} onChange={(e) => setCantidadSelected(parseInt(e.target.value) || 1)} />
                                </div>
                                <button className="btn-generar" onClick={handleAddServicio} style={{height: '42px', marginTop: 'auto'}}>
                                    <FaPlus size={12} /> Agregar
                                </button>
                            </div>
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
                                {servicios.map((srv, idx) => (
                                    <tr key={idx}>
                                        <td>{srv.nombre}</td>
                                        <td className="text-center">{srv.cantidad}</td>
                                        <td>{formatCurrency(srv.precio)}</td>
                                        <td className="subtotal-cell">{formatCurrency(srv.subtotal)}</td>
                                        <td className="action-cell">
                                            <MdDeleteOutline size={22} className="delete-icon" onClick={() => handleRemoveServicio(idx)} />
                                        </td>
                                    </tr>
                                ))}
                                {servicios.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#94a3b8'}}>
                                            Aún no has agregado servicios a la orden.
                                        </td>
                                    </tr>
                                )}
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
                            <span>IGV (18%)</span>
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


        </div>
    );
};

export default Servicios;
