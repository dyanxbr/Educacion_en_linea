'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClienteLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'USUARIO') {
      router.push('/auth/login');
    } else {
      // Cargar datos del usuario
      cargarUsuario(token);
      setIsAuthenticated(true);
    }
  }, [router]);

  const cargarUsuario = async (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const res = await fetch(`http://localhost:3000/usuarios/perfil/${payload.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuario(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    router.push('/auth/login');
  };

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Verificando acceso...</div>;
  }

  return (
    <div>
      {/* Navbar */}
      <nav style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <h1 style={{ fontSize: '1.3rem', margin: 0 }}>🎓 Mi Plataforma</h1>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/cliente/cursos" style={{ color: 'white', textDecoration: 'none' }}>📚 Cursos</a>
          <a href="/cliente/progreso" style={{ color: 'white', textDecoration: 'none' }}>📊 Mi Progreso</a>
          <a href="/cliente/certificados" style={{ color: 'white', textDecoration: 'none' }}>🎓 Certificados</a>
          <a href="/cliente/perfil" style={{ color: 'white', textDecoration: 'none' }}>👤 Mi Perfil</a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {usuario?.imagen_url ? (
              <img src={usuario.imagen_url} alt="Perfil" style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                objectFit: 'cover'
              }} />
            ) : (
              <div style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                👤
              </div>
            )}
            <button onClick={handleLogout} style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Salir
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        {children}
      </main>
    </div>
  );
}