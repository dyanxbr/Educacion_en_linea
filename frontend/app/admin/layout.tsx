'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'ADMIN') {
      router.push('/auth/login');
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    router.push('/auth/login');
  };

  if (!isAdmin) {
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <aside style={{
        width: '260px',
        backgroundColor: 'white',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0' }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0
          }}>
            F&A cursos
          </h2>
          <p style={{
            fontSize: '0.75rem',
            color: '#666',
            marginTop: '0.25rem'
          }}>
            Panel de administración
          </p>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <a
                href="/admin/dashboard"
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f2f5';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#333';
                }}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/admin/profesores"
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f2f5';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#333';
                }}
              >
                Profesores
              </a>
            </li>
            <li>
              <a
                href="/admin/cursos"
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f2f5';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#333';
                }}
              >
                Cursos
              </a>
            </li>
            <li>
              <a
                href="/admin/visualizaciones"
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f2f5';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#333';
                }}
              >
                Visualizaciones
              </a>
            </li>
            <li>
              <a
                href="/admin/calificaciones"
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f2f5';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#333';
                }}
              >
                Calificaciones
              </a>
            </li>
            <li>
              <a
                href="/admin/reportes"
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f2f5';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#333';
                }}
              >
                Reportes
              </a>
            </li>
          </ul>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #e0e0e0' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: '#dc2626',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dc262610';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
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
        backgroundColor: '#f5f5f5',
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