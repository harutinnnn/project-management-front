import React from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="glass-panel" style={{
            height: 'var(--header-height)',
            position: 'fixed',
            top: 0,
            right: 0,
            left: 'var(--sidebar-width)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 90,
            borderBottom: 'var(--glass-border)',
            borderLeft: 'none',
            borderRadius: '0'
        }}>
            <div className="search-bar" style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.6rem 1.2rem',
                borderRadius: '12px',
                width: '400px',
                border: 'var(--glass-border)'
            }}>
                <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
                <input
                    type="text"
                    placeholder="Search something..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-main)',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: 'var(--glass-border)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                }}>
                    <Bell size={20} color="var(--text-main)" />
                    <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '8px',
                        height: '8px',
                        background: '#ef4444',
                        borderRadius: '50%',
                        border: '2px solid #09090b'
                    }} />
                </button>

                <div className="user-profile" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.4rem 0.8rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: 'var(--glass-border)',
                    cursor: 'pointer'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <User size={18} color="white" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Alex Rivers</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Administrator</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
