import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { getOrdenes, getEjecuciones, getAuditorias, getIncidentes } from '../api/api';
import './Dashboard.css';

// Premium color palette
const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('month'); // 'day', 'month', 'year'
    
    // Raw Data
    const [rawData, setRawData] = useState({ ordenes: [], ejecuciones: [], auditorias: [], incidentes: [] });

    // KPIs
    const [totalOrdenes, setTotalOrdenes] = useState(0);
    const [totalEjecuciones, setTotalEjecuciones] = useState(0);
    const [promedioAuditorias, setPromedioAuditorias] = useState(0);
    const [totalIncidentes, setTotalIncidentes] = useState(0);

    // Chart Data
    const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
    const [estadoOrdenes, setEstadoOrdenes] = useState([]);
    const [incidentesGravedad, setIncidentesGravedad] = useState([]);
    const [rendimientoAuditores, setRendimientoAuditores] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (rawData.ordenes.length > 0) {
            processTimeData(rawData.ordenes, timeFilter);
        }
    }, [timeFilter, rawData]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordenesRes, ejecucionesRes, auditoriasRes, incidentesRes] = await Promise.all([
                getOrdenes(),
                getEjecuciones(),
                getAuditorias(),
                getIncidentes()
            ]);

            const ordenes = ordenesRes.data;
            const ejecuciones = ejecucionesRes.data;
            const auditorias = auditoriasRes.data;
            const incidentes = incidentesRes.data;

            setRawData({ ordenes, ejecuciones, auditorias, incidentes });

            // 1. KPIs
            setTotalOrdenes(ordenes.length);
            setTotalEjecuciones(ejecuciones.length);
            setTotalIncidentes(incidentes.length);
            
            if (auditorias.length > 0) {
                const sum = auditorias.reduce((acc, curr) => acc + curr.calificacion, 0);
                setPromedioAuditorias((sum / auditorias.length).toFixed(1));
            }

            // 3. Estado Órdenes (Donut Chart)
            const estadoMap = {};
            ordenes.forEach(ord => {
                const estado = ord.estadoOrden || 'DESCONOCIDO';
                estadoMap[estado] = (estadoMap[estado] || 0) + 1;
            });
            const estadoData = Object.keys(estadoMap).map(k => ({ name: k.replace(/_/g, ' '), value: estadoMap[k] }));
            setEstadoOrdenes(estadoData);

            // 4. Incidentes por gravedad (Bar Chart)
            const gravedadMap = {};
            incidentes.forEach(inc => {
                const grav = inc.gravedad || 'MEDIA';
                gravedadMap[grav] = (gravedadMap[grav] || 0) + 1;
            });
            const gravedadData = Object.keys(gravedadMap).map(k => ({ gravedad: k, cantidad: gravedadMap[k] }));
            setIncidentesGravedad(gravedadData);

            // 5. Rendimiento de Auditores (Table)
            const auditorMap = {};
            auditorias.forEach(aud => {
                if (aud.empleado) {
                    const nombre = aud.empleado.nombreEmp + ' ' + aud.empleado.apellidoEmp;
                    if (!auditorMap[nombre]) {
                        auditorMap[nombre] = { total: 0, sum: 0 };
                    }
                    auditorMap[nombre].total += 1;
                    auditorMap[nombre].sum += aud.calificacion;
                }
            });
            const auditoresData = Object.keys(auditorMap).map(k => ({
                nombre: k,
                cantidad: auditorMap[k].total,
                promedio: (auditorMap[k].sum / auditorMap[k].total).toFixed(1)
            })).sort((a, b) => b.cantidad - a.cantidad);
            setRendimientoAuditores(auditoresData);

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const processTimeData = (ordenes, filter) => {
        const dataMap = {};
        ordenes.forEach(ord => {
            if (ord.fechaOrden) {
                const date = new Date(ord.fechaOrden);
                let key = '';
                if (filter === 'day') {
                    key = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
                } else if (filter === 'month') {
                    key = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                } else if (filter === 'year') {
                    key = date.toLocaleDateString('es-ES', { year: 'numeric' });
                }
                
                // Capitalize first letter
                key = key.charAt(0).toUpperCase() + key.slice(1);
                dataMap[key] = (dataMap[key] || 0) + 1;
            }
        });
        
        const chartData = Object.keys(dataMap).map(k => ({ periodo: k, cantidad: dataMap[k] }));
        setOrdenesFiltradas(chartData);
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loader"></div>
                <p>Cargando métricas...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Resumen de Operaciones</h1>
                <p className="dashboard-subtitle">Métricas y rendimiento general del sistema</p>
            </div>

            {/* KPIs */}
            <div className="kpi-grid">
                <div className="kpi-card premium-card">
                    <div className="kpi-icon-wrapper blue-bg">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <div className="kpi-content">
                        <div className="kpi-label">ÓRDENES TOTALES</div>
                        <div className="kpi-value">{totalOrdenes}</div>
                    </div>
                </div>
                <div className="kpi-card premium-card">
                    <div className="kpi-icon-wrapper green-bg">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                    </div>
                    <div className="kpi-content">
                        <div className="kpi-label">SERVICIOS EJECUTADOS</div>
                        <div className="kpi-value">{totalEjecuciones}</div>
                    </div>
                </div>
                <div className="kpi-card premium-card">
                    <div className="kpi-icon-wrapper yellow-bg">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </div>
                    <div className="kpi-content">
                        <div className="kpi-label">SATISFACCIÓN (ENCUESTAS)</div>
                        <div className="kpi-value">{promedioAuditorias} <span>⭐</span></div>
                    </div>
                </div>
                <div className="kpi-card premium-card">
                    <div className="kpi-icon-wrapper red-bg">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </div>
                    <div className="kpi-content">
                        <div className="kpi-label">INCIDENTES REPORTADOS</div>
                        <div className="kpi-value" style={{color: totalIncidentes > 0 ? '#ef4444' : '#10b981'}}>{totalIncidentes}</div>
                    </div>
                </div>
            </div>

            {/* Main Area Chart with Time Filter */}
            <div className="chart-card premium-card main-chart-card">
                <div className="chart-header">
                    <div>
                        <h2 className="chart-title">Evolución de Servicios Solicitados</h2>
                        <p className="chart-subtitle">Análisis temporal de la demanda</p>
                    </div>
                    <div className="time-filters">
                        <button className={`filter-btn ${timeFilter === 'day' ? 'active' : ''}`} onClick={() => setTimeFilter('day')}>Día</button>
                        <button className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`} onClick={() => setTimeFilter('month')}>Mes</button>
                        <button className={`filter-btn ${timeFilter === 'year' ? 'active' : ''}`} onClick={() => setTimeFilter('year')}>Año</button>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={ordenesFiltradas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="periodo" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="cantidad" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="charts-grid">
                
                {/* Interactive Donut Chart */}
                <div className="chart-card premium-card">
                    <h2 className="chart-title">Estado de Órdenes</h2>
                    <p className="chart-subtitle">Distribución actual</p>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={estadoOrdenes}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {estadoOrdenes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Incidentes por Gravedad (Bar) */}
                <div className="chart-card premium-card">
                    <h2 className="chart-title">Incidentes por Gravedad</h2>
                    <p className="chart-subtitle">Clasificación de riesgos</p>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={incidentesGravedad} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                <XAxis type="number" allowDecimals={false} tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="gravedad" type="category" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="cantidad" radius={[0, 4, 4, 0]} barSize={32}>
                                    {
                                        incidentesGravedad.map((entry, index) => {
                                            const grav = entry.gravedad.toUpperCase();
                                            const fillCol = grav === 'ALTA' ? '#ef4444' : grav === 'MEDIA' ? '#f59e0b' : '#10b981';
                                            return <Cell key={`cell-${index}`} fill={fillCol} />;
                                        })
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Data Table */}
                <div className="chart-card premium-card" style={{ gridColumn: '1 / -1' }}>
                    <h2 className="chart-title">Rendimiento de Auditores</h2>
                    <div className="data-table-container">
                        <table className="modern-data-table">
                            <thead>
                                <tr>
                                    <th>Auditor</th>
                                    <th>Total Evaluaciones</th>
                                    <th>Calificación Promedio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rendimientoAuditores.length === 0 ? (
                                    <tr><td colSpan="3" className="empty-state">No hay auditorías registradas</td></tr>
                                ) : (
                                    rendimientoAuditores.map((aud, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-600 text-dark">{aud.nombre}</td>
                                            <td>
                                                <span className="badge-count">{aud.cantidad}</span>
                                            </td>
                                            <td>
                                                <div className="rating-display">
                                                    <span className="rating-number">{aud.promedio}</span>
                                                    <span className="rating-star">⭐</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;

