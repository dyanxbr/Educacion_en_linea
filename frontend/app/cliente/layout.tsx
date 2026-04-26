'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClienteLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'USUARIO') {
      router.push('/auth/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    router.push('/auth/login');
  };

  if (!isAuthenticated) {
    return <div>Verificando...</div>;
  }

  return (
    <div>
      <nav style={{ backgroundColor: '#333', color: 'white', padding: '10px', display: 'flex', gap: '20px' }}>
        <a href="/cliente/cursos" style={{ color: 'white' }}>Cursos</a>
        <a href="/cliente/perfil" style={{ color: 'white' }}>Perfil</a>
        <a href="/cliente/certificados" style={{ color: 'white' }}>Certificados</a>
        <a href="/cliente/progreso" style={{ color: 'white' }}>Progreso</a>
        <button onClick={handleLogout}>Salir</button>
      </nav>
      <main style={{ padding: '20px' }}>{children}</main>
    </div>
  );
}