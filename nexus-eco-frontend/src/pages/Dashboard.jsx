import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { getOrdenes, getEjecuciones, getAuditorias, getIncidentes } from '../api/api';
import './Dashboard.css';

const COLORS = ['#34a853', '#80e27e', '#fbbc05', '#ea4335', '#4285f4'];

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    
    // KPIs
    const [totalOrdenes, setTotalOrdenes] = useState(0);
    const [totalEjecuciones, setTotalEjecuciones] = useState(0);
    const [promedioAuditorias, setPromedioAuditorias] = useState(0);
    const [totalIncidentes, setTotalIncidentes] = useState(0);

    // Chart Data
    const [ordenesPorMes, setOrdenesPorMes] = useState([]);
    const [estadoOrdenes, setEstadoOrdenes] = useState([]);
    const [incidentesGravedad, setIncidentesGravedad] = useState([]);
    const [rendimientoAuditores, setRendimientoAuditores] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

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

            // 1. KPIs
            setTotalOrdenes(ordenes.length);
            setTotalEjecuciones(ejecuciones.length);
            setTotalIncidentes(incidentes.length);
            
            if (auditorias.length > 0) {
                const sum = auditorias.reduce((acc, curr) => acc + curr.calificacion, 0);
                setPromedioAuditorias((sum / auditorias.length).toFixed(1));
            }

            // 2. Órdenes por mes (Area Chart)
            const mesesMap = {};
            ordenes.forEach(ord => {
                if (ord.fechaOrden) {
                    const date = new Date(ord.fechaOrden);
                    const mesKey = date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
                    mesesMap[mesKey] = (mesesMap[mesKey] || 0) + 1;
                }
            });
            const ordenesData = Object.keys(mesesMap).map(k => ({ mes: k, cantidad: mesesMap[k] }));
            setOrdenesPorMes(ordenesData);

            // 3. Estado Órdenes (Donut Chart)
            const estadoMap = {};
            ordenes.forEach(ord => {
                const estado = ord.estadoOrden || 'DESCONOCIDO';
                estadoMap[estado] = (estadoMap[estado] || 0) + 1;
            });
            const estadoData = Object.keys(estadoMap).map(k => ({ name: k, value: estadoMap[k] }));
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

    if (loading) {
        return <div style={{padding: '40px', textAlign: 'center'}}>Cargando estadísticas...</div>;
    }

    return (
        <div className="dashboard-container">
            {/* KPIs */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-value">{totalOrdenes}</div>
                    <div className="kpi-label">ÓRDENES DE SERVICIO TOTALES</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-value">{totalEjecuciones}</div>
                    <div className="kpi-label">SERVICIOS EJECUTADOS</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-value">{promedioAuditorias} <span style={{fontSize: '16px'}}>⭐</span></div>
                    <div className="kpi-label">CALIFICACIÓN PROMEDIO</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-value" style={{color: totalIncidentes > 0 ? '#ea4335' : '#34a853'}}>{totalIncidentes}</div>
                    <div className="kpi-label">INCIDENTES REPORTADOS</div>
                </div>
            </div>

            {/* CHARTS */}
            <div className="charts-grid">
                
                {/* Interactive Donut Chart */}
                <div className="chart-card">
                    <div className="chart-title">Estado de Órdenes de Servicio</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={estadoOrdenes}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                dataKey="value"
                                label={({ name, value }) => `${name} (${value})`}
                            >
                                {estadoOrdenes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Suma de monto total (Area) -> Evolución de órdenes */}
                <div className="chart-card">
                    <div className="chart-title">Evolución de Servicios Solicitados (Mes a Mes)</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={ordenesPorMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#80e27e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#80e27e" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Area type="linear" dataKey="cantidad" stroke="#34a853" strokeWidth={2} fillOpacity={1} fill="url(#colorMonto)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Incidentes por Gravedad (Bar) */}
                <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="chart-title">Incidentes Reportados por Gravedad</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={incidentesGravedad} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis dataKey="gravedad" type="category" tick={{ fontSize: 12 }} width={80} />
                            <Tooltip />
                            <Bar dataKey="cantidad" fill="#ea4335" barSize={40} label={{ position: 'insideRight', fill: '#fff' }}>
                                {
                                    incidentesGravedad.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.gravedad.toUpperCase() === 'ALTA' ? '#d32f2f' : entry.gravedad.toUpperCase() === 'MEDIA' ? '#f57c00' : '#fbc02d'} />
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Data Table */}
                <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="chart-title" style={{marginBottom: '10px'}}>Rendimiento de Auditores</div>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Auditor</th>
                                    <th>Total de Auditorías Realizadas</th>
                                    <th>Promedio de Calificación Otorgada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rendimientoAuditores.length === 0 ? (
                                    <tr><td colSpan="3" style={{textAlign: 'center'}}>No hay auditorías registradas</td></tr>
                                ) : (
                                    rendimientoAuditores.map((aud, idx) => (
                                        <tr key={idx}>
                                            <td style={{fontWeight: 'bold'}}>{aud.nombre}</td>
                                            <td>{aud.cantidad}</td>
                                            <td>
                                                <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                                    {aud.promedio} <span style={{color: '#fbbc05'}}>⭐</span>
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
