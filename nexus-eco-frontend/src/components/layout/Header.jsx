
import React from 'react';

export const Header = () => {
    return (
        <header style={{
            height: 'var(--header-height)',
            backgroundColor: 'var(--surface-color)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            justifyContent: 'flex-end',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontWeight: 'bold' }}>Admin User</span>
                <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>
            </div>
        </header>
    );
}
