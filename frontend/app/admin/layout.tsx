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
    return <div>Verificando acceso...</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', backgroundColor: '#333', color: 'white', minHeight: '100vh', padding: '20px' }}>
        <h3>Admin Panel</h3>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/admin/dashboard" style={{ color: 'white' }}>Dashboard</a></li>
            <li><a href="/admin/profesores" style={{ color: 'white' }}>Profesores</a></li>
            <li><a href="/admin/cursos" style={{ color: 'white' }}>Cursos</a></li>
            <li><a href="/admin/visualizaciones" style={{ color: 'white' }}>Visualizaciones</a></li>
            <li><a href="/admin/calificaciones" style={{ color: 'white' }}>Calificaciones</a></li>
            <li><a href="/admin/reportes" style={{ color: 'white' }}>Reportes</a></li>
          </ul>
        </nav>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </aside>
      <main style={{ flex: 1, padding: '20px' }}>{children}</main>
    </div>
  );
}