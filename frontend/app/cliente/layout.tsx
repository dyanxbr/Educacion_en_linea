'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';

export default function ClienteLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [temaActual, setTemaActual] = useState('CLARO');

  const getUsuarioId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  };

  const cargarTema = async () => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return;
    const data = await apiGet(`/usuarios/perfil/${usuarioId}`);
    const tema = data.tema || 'CLARO';
    setTemaActual(tema);
    document.body.style.backgroundColor = tema === 'OSCURO' ? '#121212' : '#f5f5f5';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'USUARIO') {
      router.push('/auth/login');
    } else {
      cargarTema();
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    router.push('/auth/login');
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e0e0e0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  const isDark = temaActual === 'OSCURO';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: isDark ? '#121212' : '#f5f5f5' }}>
      <aside style={{
        width: '260px',
        backgroundColor: isDark ? '#1e1e1e' : 'white',
        borderRight: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: `1px solid ${isDark ? '#333' : '#e0e0e0'}` }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: isDark ? '#fff' : '#1a1a1a',
            margin: 0
          }}>
            F&A cursos
          </h2>
          <p style={{
            fontSize: '0.75rem',
            color: isDark ? '#888' : '#666',
            marginTop: '0.25rem'
          }}>
            Panel de estudiante
          </p>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <a
                href="/cliente/cursos"
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: isDark ? '#ddd' : '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#f0f2f5';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? '#ddd' : '#333';
                }}
              >
                Cursos
              </a>
            </li>
            <li>
              <a
                href="/cliente/perfil"
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: isDark ? '#ddd' : '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#f0f2f5';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? '#ddd' : '#333';
                }}
              >
                Perfil
              </a>
            </li>
            <li>
              <a
                href="/cliente/certificados"
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: isDark ? '#ddd' : '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#f0f2f5';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? '#ddd' : '#333';
                }}
              >
                Certificados
              </a>
            </li>
            <li>
              <a
                href="/cliente/progreso"
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: isDark ? '#ddd' : '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#f0f2f5';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? '#ddd' : '#333';
                }}
              >
                Progreso
              </a>
            </li>
          </ul>
        </nav>

        <div style={{ padding: '1rem', borderTop: `1px solid ${isDark ? '#333' : '#e0e0e0'}` }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: '#dc2626',
              border: '1px solid #dc2626',
              padding: '0.6rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#dc2626';
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main style={{
        flex: 1,
        marginLeft: '260px',
        padding: '2rem',
        maxWidth: 'calc(100% - 260px)',
        minHeight: '100vh'
      }}>
        {children}
      </main>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}