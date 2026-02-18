import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  BarChart3,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: ShoppingBag, label: 'Products', path: '/products' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar glass-panel" style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      zIndex: 100,
      borderRight: 'var(--glass-border)',
      borderRadius: '0 24px 24px 0'
    }}>
      <div className="sidebar-header" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2.5rem',
        paddingLeft: '0.5rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, var(--primary-color), #4f46e5)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px var(--primary-glow)'
        }}>
          <div style={{ width: '16px', height: '16px', background: 'white', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        </div>
        <span className="brand-text" style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          background: 'linear-gradient(to right, #fff, #a1a1aa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ADIN PANEL
        </span>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                <Link
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    textDecoration: 'none',
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                    borderRadius: '12px',
                    backgroundColor: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                  className={isActive ? '' : 'nav-hover'}
                >
                  <Icon size={20} color={isActive ? 'var(--primary-color)' : 'currentColor'} />
                  <span style={{ fontWeight: isActive ? 600 : 400, fontSize: '0.9rem' }}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1rem',
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: '#f87171',
            cursor: 'pointer',
            borderRadius: '12px',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Logout</span>
        </button>
      </div>

      <style>{`
        .nav-hover:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
