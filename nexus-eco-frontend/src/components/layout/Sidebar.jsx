
import React from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard, MdPeople, MdWork, MdEvent, MdAssignment, MdSecurity, MdFeedback } from 'react-icons/md';

export const Sidebar = () => {
    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            backgroundColor: 'var(--surface-color)',
            borderRight: '1px solid var(--border-color)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: '20px 0',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h2 style={{ padding: '0 20px', color: 'var(--primary-color)' }}>Nexus Eco</h2>
            <nav style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                <Link to="/dashboard" style={linkStyle}><MdDashboard style={iconStyle} /> Dashboard</Link>
                <Link to="/clientes" style={linkStyle}><MdPeople style={iconStyle} /> Clientes</Link>
                <Link to="/servicios" style={linkStyle}><MdWork style={iconStyle} /> Servicios</Link>
                <Link to="/planificacion" style={linkStyle}><MdEvent style={iconStyle} /> Planificación</Link>
                <Link to="/ejecucion" style={linkStyle}><MdAssignment style={iconStyle} /> Ejecución</Link>
                <Link to="/auditoria" style={linkStyle}><MdSecurity style={iconStyle} /> Auditoría</Link>
                <Link to="/satisfaccion" style={linkStyle}><MdFeedback style={iconStyle} /> Satisfacción</Link>
            </nav>
        </aside>
    );
}

const linkStyle = {
    padding: '12px 20px',
    textDecoration: 'none',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '500',
    transition: 'background 0.2s'
};

const iconStyle = { marginRight: '10px', fontSize: '1.2rem', color: 'var(--primary-color)' };
