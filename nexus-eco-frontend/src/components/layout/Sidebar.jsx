import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    MdHome, MdPeople, MdDescription, MdListAlt, MdEvent, MdAssignment, 
    MdSecurity, MdWarning, MdAssessment, MdSettings, MdHelp, MdStarRate, 
    MdBuild, MdHomeRepairService, MdEngineering 
} from 'react-icons/md';

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
                <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: '800' }}>Econex<span style={{ color: '#4f46e5' }}>us</span></h2>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px', marginTop: '4px', textTransform: 'uppercase' }}>Admin Dashboard</div>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div className="menu-category">Operativo</div>
                <Link to="/dashboard" className={`nav-link ${isActive('dashboard')}`}><MdHome size={20} className="nav-icon" /> Inicio</Link>
                <Link to="/clientes" className={`nav-link ${isActive('clientes')}`}><MdPeople size={20} className="nav-icon" /> Clientes</Link>
                <Link to="/servicios" className={`nav-link ${isActive('servicios')}`}><MdDescription size={20} className="nav-icon" /> Solicitudes</Link>
                <Link to="/ordenes-trabajo" className={`nav-link ${isActive('ordenes-trabajo')}`}><MdAssignment size={20} className="nav-icon" /> Órdenes Trabajo</Link>
                <Link to="/planificacion" className={`nav-link ${isActive('planificacion')}`}><MdEvent size={20} className="nav-icon" /> Planificación</Link>
                <Link to="/ejecucion" className={`nav-link ${isActive('ejecucion')}`}><MdAssignment size={20} className="nav-icon" /> Ejecución</Link>
                <Link to="/auditoria" className={`nav-link ${isActive('auditoria')}`}><MdSecurity size={20} className="nav-icon" /> Auditoría</Link>
                <Link to="/informes" className={`nav-link ${isActive('informes')}`}><MdAssessment size={20} className="nav-icon" /> Informes</Link>
                <Link to="/satisfaccion" className={`nav-link ${isActive('satisfaccion')}`}><MdStarRate size={20} className="nav-icon" /> Satisfacción (Mongo)</Link>

                <div className="menu-category">Configuración</div>
                <Link to="/empleados" className={`nav-link ${isActive('empleados')}`}><MdBuild size={20} className="nav-icon" /> Empleados</Link>
                <Link to="/tipos-servicio" className={`nav-link ${isActive('tipos-servicio')}`}><MdHomeRepairService size={20} className="nav-icon" /> Catálogo Servicios</Link>
                <Link to="/tecnicos" className={`nav-link ${isActive('tecnicos')}`}><MdEngineering size={20} className="nav-icon" /> Técnicos / Espec.</Link>
            </nav>

            <div style={{ padding: '20px 0', borderTop: '1px solid #e2e8f0' }}>
                <Link to="/configuracion" className="nav-link"><MdSettings size={20} className="nav-icon" /> Configuración</Link>
                <Link to="/soporte" className="nav-link"><MdHelp size={20} className="nav-icon" /> Soporte</Link>
            </div>

            <style>{`
                .menu-category {
                    padding: 16px 24px 6px 24px;
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .nav-link {
                    padding: 10px 24px;
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
                    color: #4f46e5;
                    font-weight: 600;
                    border-left: 3px solid #4f46e5;
                }
                .nav-icon {
                    margin-right: 12px;
                    color: #64748b;
                }
                .nav-link.active .nav-icon {
                    color: #4f46e5;
                }
            `}</style>
        </aside>
    );
}
