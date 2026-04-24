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
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Verificando acceso...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: 'white', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '2rem', textAlign: 'center' }}>🎓 Admin Panel</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem' }}>
              <a href="/admin/dashboard" style={{ color: 'white', textDecoration: 'none', display: 'block', padding: '0.5rem', borderRadius: '5px', backgroundColor: '#334155' }}>
                📊 Dashboard
              </a>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <a href="/admin/profesores" style={{ color: 'white', textDecoration: 'none', display: 'block', padding: '0.5rem', borderRadius: '5px' }}>
                👨‍🏫 Profesores
              </a>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <a href="/admin/cursos" style={{ color: 'white', textDecoration: 'none', display: 'block', padding: '0.5rem', borderRadius: '5px' }}>
                📚 Cursos
              </a>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <a href="/admin/visualizaciones" style={{ color: 'white', textDecoration: 'none', display: 'block', padding: '0.5rem', borderRadius: '5px' }}>
                👁️ Visualizaciones
              </a>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <a href="/admin/calificaciones" style={{ color: 'white', textDecoration: 'none', display: 'block', padding: '0.5rem', borderRadius: '5px' }}>
                ⭐ Calificaciones
              </a>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <a href="/admin/reportes" style={{ color: 'white', textDecoration: 'none', display: 'block', padding: '0.5rem', borderRadius: '5px' }}>
                📈 Reportes
              </a>
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          style={{
            marginTop: '3rem',
            width: '100%',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '0.75rem',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f8fafc' }}>
        {children}
      </main>
    </div>
  );
}