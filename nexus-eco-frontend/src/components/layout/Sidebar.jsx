import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdPeople, MdDescription, MdListAlt, MdEvent, MdAssignment, MdSecurity, MdWarning, MdAssessment, MdSettings, MdHelp } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';

export const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname.includes(path) ? 'active' : '';
    };

    return (
        <aside style={{
            width: '260px',
            backgroundColor: '#f8fafc',
            borderRight: '1px solid #e2e8f0',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ padding: '24px 20px' }}>
                <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: '800' }}>Econex<span style={{color: '#0b7a75'}}>us</span></h2>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px', marginTop: '4px', textTransform: 'uppercase' }}>Admin Dashboard</div>
            </div>

            <div style={{ padding: '0 20px', marginBottom: '20px' }}>
                <button style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '4px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                }}>
                    <FaPlus size={12} /> Nueva Solicitud
                </button>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <Link to="/dashboard" className={`nav-link ${isActive('dashboard')}`}><MdHome size={20} className="nav-icon" /> Inicio</Link>
                <Link to="/clientes" className={`nav-link ${isActive('clientes')}`}><MdPeople size={20} className="nav-icon" /> Clientes</Link>
                <Link to="/servicios" className={`nav-link ${isActive('servicios')}`}><MdDescription size={20} className="nav-icon" /> Solicitudes</Link>
                <Link to="/ordenes" className={`nav-link ${isActive('ordenes')}`}><MdListAlt size={20} className="nav-icon" /> Órdenes de servicio</Link>
                <Link to="/planificacion" className={`nav-link ${isActive('planificacion')}`}><MdEvent size={20} className="nav-icon" /> Planificación</Link>
                <Link to="/ejecucion" className={`nav-link ${isActive('ejecucion')}`}><MdAssignment size={20} className="nav-icon" /> Ejecución</Link>
                <Link to="/auditoria" className={`nav-link ${isActive('auditoria')}`}><MdSecurity size={20} className="nav-icon" /> Auditoría</Link>
                <Link to="/incidencias" className={`nav-link ${isActive('incidencias')}`}><MdWarning size={20} className="nav-icon" /> Incidencias</Link>
                <Link to="/informes" className={`nav-link ${isActive('informes')}`}><MdAssessment size={20} className="nav-icon" /> Informes</Link>
            </nav>

            <div style={{ padding: '20px 0', borderTop: '1px solid #e2e8f0' }}>
                <Link to="/configuracion" className="nav-link"><MdSettings size={20} className="nav-icon" /> Configuración</Link>
                <Link to="/soporte" className="nav-link"><MdHelp size={20} className="nav-icon" /> Soporte</Link>
            </div>
            
            <style>{`
                .nav-link {
                    padding: 12px 24px;
                    text-decoration: none;
                    color: #475569;
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                    font-size: 14px;
                    transition: all 0.2s;
                    border-left: 3px solid transparent;
                }
                .nav-link:hover {
                    background-color: #f1f5f9;
                    color: #0f172a;
                }
                .nav-link.active {
                    background-color: #f1f5f9;
                    color: #0f172a;
                    font-weight: 600;
                    border-left: 3px solid #0f172a;
                }
                .nav-icon {
                    margin-right: 12px;
                    color: #64748b;
                }
                .nav-link.active .nav-icon {
                    color: #0f172a;
                }
            `}</style>
        </aside>
    );
}
