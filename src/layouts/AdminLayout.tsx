import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout-container" style={{ minHeight: '100vh', display: 'flex' }}>
            <Sidebar />
            <div className="main-wrapper" style={{
                flex: 1,
                marginLeft: 'var(--sidebar-width)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Header />
                <main className="content-area" style={{
                    marginTop: 'var(--header-height)',
                    padding: '2rem',
                    flex: 1
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
