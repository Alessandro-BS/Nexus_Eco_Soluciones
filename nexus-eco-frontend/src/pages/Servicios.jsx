import React, { useState, useEffect } from 'react';
import { 
    MdClose, MdAssignment, MdSearch, MdEvent, MdDeleteOutline, MdHistory, 
    MdLocalOffer, MdPrint, MdAdd, MdArrowBack, MdSave, MdVisibility 
} from 'react-icons/md';
import { 
    MdAdd as MdAddIcon, MdArrowBack as MdBackIcon, MdSave as MdSaveIcon, 
    MdDeleteOutline as MdDeleteIcon, MdVisibility as MdEyeIcon, MdAssignment as MdOrderIcon 
} from 'react-icons/md';
import { 
    getClientes, getEmpleados, getTiposServicio, getOrdenes, 
    createSolicitud, createOrdenServicio, updateOrdenServicio, deleteOrdenServicio 
} from '../api/api';
import './Servicios.css';

const Servicios = () => {
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [ordenes, setOrdenes] = useState([]);
    
    // Filters state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    
    // Dropdown Data
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [tiposServicio, setTiposServicio] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Details Modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrden, setSelectedOrden] = useState(null);

    // Form State
    const [solicitud, setSolicitud] = useState({
        idCliente: '',
        fecha: new Date().toISOString().split('T')[0],
        idEmpleado: '',
        estado: 'PENDIENTE',
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
            setClientes(resClientes.data.filter(c => c.estado === 'ACTIVO'));
            setEmpleados(resEmpleados.data);
            setTiposServicio(resTipos.data);
            
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

    const handleNew = () => {
        setSelectedOrden(null);
        setEditingId(null);
        setServicios([]);
        setSolicitud({
            idCliente: clientes.length > 0 ? clientes[0].idCliente : '',
            fecha: new Date().toISOString().split('T')[0],
            idEmpleado: empleados.length > 0 ? empleados[0].idEmpleado : '',
            estado: 'PENDIENTE',
            descripcion: ''
        });
        setView('form');
    };

    const handleEdit = (ord) => {
        setSelectedOrden(ord);
        setEditingId(ord.idOrdenServicio);
        const sol = ord.solicitudServicio || {};
        
        // Populate services from order details
        const mappedServicios = (ord.detalles || []).map(d => ({
            idTipoServicio: d.tipoService?.idTipoServicio || d.tipoServicio?.idTipoServicio,
            nombre: d.tipoService?.nombreServicio || d.tipoServicio?.nombreServicio || 'Servicio',
            cantidad: d.cantidad,
            precio: d.precioUnitario,
            subtotal: d.subtotal
        }));
        setServicios(mappedServicios);

        setSolicitud({
            idCliente: sol.cliente ? sol.cliente.idCliente.toString() : '',
            fecha: sol.fechaSolicitud ? sol.fechaSolicitud.split('T')[0] : new Date().toISOString().split('T')[0],
            idEmpleado: sol.empleado ? sol.empleado.idEmpleado.toString() : '',
            estado: ord.estadoOrden || 'PENDIENTE',
            descripcion: sol.descripcionSol || ''
        });
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de que desea eliminar esta orden y su solicitud asociada?")) {
            try {
                await deleteOrdenServicio(id);
                alert("Orden eliminada exitosamente");
                fetchOrdenes();
            } catch (error) {
                console.error("Error al eliminar orden", error);
                alert("No se pudo eliminar el registro. Puede estar planificado.");
            }
        }
    };

    const handleGenerarOrden = async () => {
        if (!solicitud.idCliente || !solicitud.idEmpleado || servicios.length === 0) {
            alert("Debe seleccionar un cliente, un empleado y agregar al menos un servicio.");
            return;
        }

        try {
            // 1. Payload
            const payload = {
                idOrdenServicio: editingId,
                fechaOrden: new Date().toISOString(),
                estadoOrden: solicitud.estado,
                montoTotal: total,
                solicitudServicio: {
                    idSolicitudServicio: selectedOrden?.solicitudServicio?.idSolicitudServicio || null,
                    fechaSolicitud: `${solicitud.fecha}T00:00:00`,
                    descripcionSol: solicitud.descripcion,
                    estadoSol: 'APROBADA',
                    cliente: { idCliente: parseInt(solicitud.idCliente) },
                    empleado: { idEmpleado: parseInt(solicitud.idEmpleado) }
                },
                detalles: servicios.map(s => ({
                    cantidad: s.cantidad,
                    precioUnitario: s.precio,
                    subtotal: s.subtotal,
                    tipoServicio: { idTipoServicio: s.idTipoServicio }
                }))
            };

            if (editingId) {
                await updateOrdenServicio(editingId, payload);
                alert("Orden de servicio actualizada exitosamente!");
            } else {
                await createOrdenServicio(payload);
                alert("Orden generada exitosamente!");
            }
            
            // Reset and go back
            setServicios([]);
            setSolicitud({ ...solicitud, descripcion: '' });
            setView('list');
            
        } catch (error) {
            console.error("Error al guardar la orden", error);
            alert("Ocurrió un error al guardar la orden de servicio.");
        }
    };

    const handleOpenDetails = (ord) => {
        setSelectedOrden(ord);
        setShowDetailsModal(true);
    };

    if (view === 'list') {
        const filteredOrdenes = ordenes.filter(ord => {
            const clientName = (ord.solicitudServicio?.cliente?.razonSocial || '').toLowerCase();
            const matchesSearch = clientName.includes(searchQuery.toLowerCase()) || 
                                  String(ord.idOrdenServicio).includes(searchQuery);
            const matchesStatus = statusFilter === 'ALL' || ord.estadoOrden === statusFilter;
            
            const total = ord.montoTotal || 0;
            const matchesMin = minAmount === '' || total >= parseFloat(minAmount);
            const matchesMax = maxAmount === '' || total <= parseFloat(maxAmount);
            
            return matchesSearch && matchesStatus && matchesMin && matchesMax;
        });

        const handleClearFilters = () => {
            setSearchQuery('');
            setStatusFilter('ALL');
            setMinAmount('');
            setMaxAmount('');
        };

        return (
            <div className="servicios-page">
                <div className="breadcrumb">GESTIÓN / SERVICIOS</div>
                
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Historial de Órdenes</h1>
                        <p className="page-subtitle">Visualiza y administra las solicitudes y órdenes de servicio del sistema.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-nuevo" onClick={handleNew}>
                            <MdAddIcon size={18} /> Nueva Solicitud
                        </button>
                    </div>
                </div>

                <div className="filters-bar">
                    <div className="filter-group search">
                        <span className="filter-label">Buscar Orden</span>
                        <input 
                            type="text" 
                            className="filter-input" 
                            placeholder="Buscar por cliente o ID de orden..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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
                    <div className="filter-group" style={{ flex: 1, minWidth: '120px' }}>
                        <span className="filter-label">Monto Mín</span>
                        <input 
                            type="number" 
                            className="filter-input" 
                            placeholder="S/. Min" 
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                        />
                    </div>
                    <div className="filter-group" style={{ flex: 1, minWidth: '120px' }}>
                        <span className="filter-label">Monto Máx</span>
                        <input 
                            type="number" 
                            className="filter-input" 
                            placeholder="S/. Max" 
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                        />
                    </div>
                    {(searchQuery || statusFilter !== 'ALL' || minAmount || maxAmount) && (
                        <div className="filter-group action">
                            <button className="btn-filter-clear" onClick={handleClearFilters}>
                                Limpiar
                            </button>
                        </div>
                    )}
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
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                            ) : filteredOrdenes.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No se encontraron órdenes con los filtros aplicados.</td></tr>
                            ) : (
                                filteredOrdenes.map(ord => {
                                    const canEditDelete = ord.estadoOrden === 'PENDIENTE' || ord.estadoOrden === 'EN_PROCESO';
                                    return (
                                        <tr key={ord.idOrdenServicio}>
                                            <td style={{ fontWeight: 'bold' }}># {ord.idOrdenServicio}</td>
                                            <td>{new Date(ord.fechaOrden).toLocaleDateString()}</td>
                                            <td>{ord.solicitudServicio?.cliente?.razonSocial || 'Desconocido'}</td>
                                            <td style={{ color: '#0b7a75', fontWeight: 'bold' }}>{formatCurrency(ord.montoTotal)}</td>
                                            <td>
                                                <span className={`status-badge status-${ord.estadoOrden?.toLowerCase()}`}>
                                                    {ord.estadoOrden?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn-table-details" onClick={() => handleOpenDetails(ord)} title="Ver Detalles">
                                                    <MdEyeIcon size={16} /> Detalles
                                                </button>
                                                {canEditDelete && (
                                                    <>
                                                        <button className="btn-table-edit" onClick={() => handleEdit(ord)}>Editar</button>
                                                        <button className="btn-table-delete" onClick={() => handleDelete(ord.idOrdenServicio)}>Borrar</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedOrden && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ width: '600px' }}>
                            <div className="modal-header">
                                <h2>Detalles de Orden de Servicio # {selectedOrden.idOrdenServicio}</h2>
                                <button className="btn-close" onClick={() => setShowDetailsModal(false)}>
                                    <MdClose size={20} />
                                </button>
                            </div>
                            <div className="modal-body" style={{ fontSize: '14px', color: '#334155' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <div><strong>Cliente:</strong> {selectedOrden.solicitudServicio?.cliente?.razonSocial}</div>
                                    <div><strong>RUC:</strong> {selectedOrden.solicitudServicio?.cliente?.ruc}</div>
                                    <div><strong>Fecha Orden:</strong> {new Date(selectedOrden.fechaOrden).toLocaleString()}</div>
                                    <div><strong>Estado:</strong> {selectedOrden.estadoOrden}</div>
                                    <div><strong>Empleado Atiende:</strong> {selectedOrden.solicitudServicio?.empleado?.nombreEmp} {selectedOrden.solicitudServicio?.empleado?.apellidoEmp}</div>
                                    <div><strong>Total a Pagar:</strong> {formatCurrency(selectedOrden.montoTotal)}</div>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <strong>Descripción de Solicitud:</strong>
                                    <p style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', fontStyle: 'italic', marginTop: '6px' }}>
                                        {selectedOrden.solicitudServicio?.descripcionSol || 'Sin descripción adicional.'}
                                    </p>
                                </div>
                                <div>
                                    <strong>Servicios Contratados:</strong>
                                    <table className="servicios-table" style={{ marginTop: '10px', width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Servicio</th>
                                                <th>Cantidad</th>
                                                <th>Precio</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(selectedOrden.detalles || []).map((det, idx) => (
                                                <tr key={idx}>
                                                    <td>{det.tipoServicio?.nombreServicio || det.tipoService?.nombreServicio || 'Servicio'}</td>
                                                    <td>{det.cantidad}</td>
                                                    <td>{formatCurrency(det.precioUnitario)}</td>
                                                    <td>{formatCurrency(det.subtotal)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="servicios-page">
            <div className="breadcrumb">
                <span className="badge-dark">SOLICITUD_SERVICIO</span> / {editingId ? `EDITAR_REGISTRO #${editingId}` : 'NUEVO_REGISTRO'}
            </div>
            
            <div className="page-header">
                <div>
                    <h1 className="page-title">{editingId ? 'Editar Solicitud' : 'Solicitud de Servicio'}</h1>
                    <p className="page-subtitle">Configure los detalles específicos para la realización de los trabajos contratados.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-cancelar" onClick={() => setView('list')}>
                        <MdBackIcon size={16} /> Volver
                    </button>
                    <button className="btn-generar" onClick={handleGenerarOrden}>
                        <MdSaveIcon size={16} /> {editingId ? 'Guardar Cambios' : 'Generar orden de servicio'}
                    </button>
                </div>
            </div>

            <div className="content-layout">
                <div className="main-column">
                    <div className="form-card">
                        <div className="card-header">
                            <MdOrderIcon size={22} className="card-icon" />
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
                            <label>Estado de la Orden</label>
                            <select value={solicitud.estado} onChange={(e) => setSolicitud({...solicitud, estado: e.target.value})}>
                                <option value="PENDIENTE">PENDIENTE</option>
                                <option value="EN_PROCESO">EN PROCESO</option>
                                <option value="COMPLETADO">COMPLETADO</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Descripción del servicio solicitado</label>
                            <textarea 
                                placeholder="Detalle los requerimientos específicos del cliente..." 
                                rows="3"
                                value={solicitud.descripcion}
                                onChange={(e) => setSolicitud({...solicitud, descripcion: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '4px',
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
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
                                <button className="btn-generar" onClick={handleAddServicio} style={{height: '42px', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    Agregar
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
                                            <MdDeleteIcon size={22} className="delete-icon" onClick={() => handleRemoveServicio(idx)} style={{ cursor: 'pointer', color: '#ef4444' }} />
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
                            Resumen de Totales
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
                </div>
            </div>
        </div>
    );
};

export default Servicios;
