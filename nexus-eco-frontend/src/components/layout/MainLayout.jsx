
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ 
                flex: 1, 
                marginLeft: 'var(--sidebar-width)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Header />
                <main style={{ padding: '24px', flex: 1 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
