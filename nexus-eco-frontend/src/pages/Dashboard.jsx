import React, { useState } from 'react';
import { 
  AreaChart, Area, 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import './Dashboard.css';

// --- MOCK DATA ---
const facturacionMensual = [
  { mes: 'ene 2025', monto: 8000 },
  { mes: 'feb 2025', monto: 5000 },
  { mes: 'mar 2025', monto: 10000 },
  { mes: 'abr 2025', monto: 14000 },
  { mes: 'may 2025', monto: 9000 },
  { mes: 'jun 2025', monto: 17000 },
  { mes: 'jul 2025', monto: 3000 },
  { mes: 'ago 2025', monto: 8000 },
  { mes: 'sep 2025', monto: 8000 },
  { mes: 'oct 2025', monto: 14000 },
  { mes: 'nov 2025', monto: 3000 },
  { mes: 'dic 2025', monto: 20000 },
  { mes: 'ene 2026', monto: 3000 },
  { mes: 'feb 2026', monto: 11000 },
  { mes: 'mar 2026', monto: 5000 },
  { mes: 'abr 2026', monto: 14000 },
];

const calificacionEspecialidad = [
  { nombre: 'Especialista en Pla...', calificacion: 3.6 },
  { nombre: 'Ingeniero Químico', calificacion: 3.7 },
  { nombre: 'Auditor Ambiental', calificacion: 3.7 },
  { nombre: 'Ingeniero Sanitario', calificacion: 3.9 },
];

// Interactive Pie Chart Data
const donutData = {
    "Facturacion Total": [
        { name: '2025', value: 537.54, fill: '#34a853' }, 
        { name: '2026', value: 166.05, fill: '#80e27e' }
    ],
    "Facturacion Promedio": [
        { name: '2025', value: 3, fill: '#34a853' }, 
        { name: '2026', value: 3, fill: '#80e27e' }
    ],
    "Cantidad Incidentes": [
        { name: '2025', value: 42, fill: '#34a853' }, 
        { name: '2026', value: 12, fill: '#80e27e' }
    ],
    "Calificacion Promedio": [
        { name: '2025', value: 3.7, fill: '#34a853' }, 
        { name: '2026', value: 3.8, fill: '#80e27e' }
    ]
};

const formatValue = (tab, value) => {
    if (tab.includes('Facturacion')) return `${value} mil`;
    return `${value}`;
};

const tablaEmpleados = [
  { nombre: 'Ing. Carlos Mendoza', cancelado: '2.814,37', completado: '180.119,68', pendiente: '16.886,22', total: '199.820,27' },
  { nombre: 'Ing. Marcos Torres', cancelado: '8.443,11', completado: '143.532,87', pendiente: '22.514,96', total: '174.490,94' },
  { nombre: 'Lic. Sofía Ramos', cancelado: '16.886,22', completado: '149.161,61', pendiente: '19.700,59', total: '185.748,42' },
  { nombre: 'Tec. Juan Palacios', cancelado: '11.257,48', completado: '121.017,91', pendiente: '11.257,48', total: '143.532,87' }
];

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('Facturacion Total');

    return (
        <div className="dashboard-container">
            {/* KPIs */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-value">703,59 mil</div>
                    <div className="kpi-label">FACTURACIÓN TOTAL</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-value">3 mil</div>
                    <div className="kpi-label">FACTURACIÓN PROMEDIO</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-value">54</div>
                    <div className="kpi-label">CANTIDAD DE SERVICIOS</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-value">3,7</div>
                    <div className="kpi-label">CALIFICACIÓN PROMEDIO</div>
                </div>
            </div>

            {/* CHARTS */}
            <div className="charts-grid">
                
                {/* Interactive Donut Chart */}
                <div className="chart-card">
                    <div className="chart-tabs">
                        {Object.keys(donutData).map((tab) => (
                            <div 
                                key={tab} 
                                className={`chart-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                    
                    <div className="chart-title">{activeTab} por Año</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={donutData[activeTab]}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                dataKey="value"
                                label={({ name, value }) => formatValue(activeTab, value)}
                            >
                                {donutData[activeTab].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatValue(activeTab, value)} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', fontSize: '14px', marginTop: '-10px' }}>
                        <span style={{ color: '#34a853' }}>● 2025</span>
                        <span style={{ color: '#80e27e' }}>● 2026</span>
                    </div>
                </div>

                {/* Suma de monto total (Area) */}
                <div className="chart-card">
                    <div className="chart-title">Suma de monto total por año por Año, Trimestre y Mes</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={facturacionMensual} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#80e27e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#80e27e" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="mes" tick={{ fontSize: 12 }} interval="preserveStartEnd" minTickGap={30} />
                            <YAxis tickFormatter={(value) => `${value / 1000} mil`} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value) => `${value}`} />
                            <Area type="linear" dataKey="monto" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#colorMonto)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Calificacion por Especialidad (Bar) */}
                <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="chart-title">Calificación Promedio por especialidad</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={calificacionEspecialidad} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" domain={[0, 4]} hide />
                            <YAxis dataKey="nombre" type="category" tick={{ fontSize: 12 }} width={150} />
                            <Tooltip />
                            <Bar dataKey="calificacion" fill="#80e27e" barSize={30} label={{ position: 'insideRight', fill: '#000' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Data Table */}
                <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>nombre</th>
                                    <th>Cancelado</th>
                                    <th>Completado</th>
                                    <th>Pendiente</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tablaEmpleados.map((emp, idx) => (
                                    <tr key={idx}>
                                        <td>{emp.nombre}</td>
                                        <td>{emp.cancelado}</td>
                                        <td>{emp.completado}</td>
                                        <td>{emp.pendiente}</td>
                                        <td>{emp.total}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>Total</td>
                                    <td>39.401,18</td>
                                    <td>593.832,07</td>
                                    <td>70.359,25</td>
                                    <td>703.592,50</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
