import React from 'react';
import { MdSearch, MdNotificationsNone, MdHelpOutline, MdApps } from 'react-icons/md';

export const Header = () => {
    return (
        <header style={{
            height: '70px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 30px',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div style={{ flex: 1, maxWidth: '500px', position: 'relative' }}>
                <MdSearch size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                    type="text" 
                    placeholder="Buscar clientes o documentos..." 
                    style={{
                        width: '100%',
                        padding: '10px 10px 10px 40px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        color: '#334155'
                    }}
                />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', color: '#475569', borderRight: '1px solid #e2e8f0', paddingRight: '20px' }}>
                    <MdNotificationsNone size={22} style={{ cursor: 'pointer' }} />
                    <MdHelpOutline size={22} style={{ cursor: 'pointer' }} />
                    <MdApps size={22} style={{ cursor: 'pointer' }} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>Admin User</div>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px' }}>SUPERVISOR</div>
                    </div>
                    <img 
                        src="https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff&size=40" 
                        alt="Profile" 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                </div>
            </div>
        </header>
    );
}
