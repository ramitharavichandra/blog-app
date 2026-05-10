import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

const NAV_BG = '#0f172a';
const BORDER = '1px solid #1e293b';

const navLink = (active) => ({
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
  color: active ? '#f8fafc' : '#94a3b8',
  transition: 'color 0.2s',
});

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav style={{ backgroundColor: NAV_BG, borderBottom: BORDER, position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Main bar */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px',
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" onClick={close} style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em' }}>
            Blog<span style={{ color: '#3b82f6' }}>Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <Link to="/" style={navLink(isActive('/'))}>Home</Link>
            {token ? (
              <>
                <Link to="/dashboard" style={navLink(isActive('/dashboard'))}>Dashboard</Link>

                {/* Avatar → Profile */}
                <Link to="/profile" style={{ textDecoration: 'none' }} title={user?.name}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    border: isActive('/profile') ? '2px solid #3b82f6' : '2px solid transparent',
                  }}>
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </Link>

                <Link
                  to="/create"
                  style={{
                    textDecoration: 'none', padding: '7px 16px', borderRadius: 8,
                    background: '#2563eb', color: 'white', fontSize: 13, fontWeight: 700,
                  }}
                >
                  + Write
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none', border: '1.5px solid #334155', borderRadius: 8,
                    color: '#94a3b8', fontSize: 13, fontWeight: 600, padding: '7px 16px',
                    cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    textDecoration: 'none', padding: '7px 16px', borderRadius: 8,
                    background: '#2563eb', color: 'white', fontSize: 13, fontWeight: 700,
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    textDecoration: 'none', padding: '7px 16px', borderRadius: 8,
                    border: '1.5px solid #334155', color: '#94a3b8', fontSize: 13, fontWeight: 600,
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile: right side */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {token && (
              <Link to="/create" onClick={close} style={{
                textDecoration: 'none', padding: '6px 14px', borderRadius: 8,
                background: '#2563eb', color: 'white', fontSize: 13, fontWeight: 700,
              }}>
                + Write
              </Link>
            )}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: 4 }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{ borderTop: BORDER, backgroundColor: '#0c1526', padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link to="/" onClick={close} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Home</Link>
          {token ? (
            <>
              <Link to="/dashboard" onClick={close} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Dashboard</Link>
              <Link to="/profile" onClick={close} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
                Profile ({user?.name})
              </Link>
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 15, fontWeight: 500, textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={close} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Login</Link>
              <Link to="/register" onClick={close} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
