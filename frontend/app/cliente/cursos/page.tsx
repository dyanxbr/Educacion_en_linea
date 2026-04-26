'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [temaActual, setTemaActual] = useState('CLARO');

  const getUsuarioId = () => {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token!.split('.')[1]));
    return payload.id;
  };

  const cargarTema = async () => {
    const usuarioId = getUsuarioId();
    const data = await apiGet(`/usuarios/perfil/${usuarioId}`);
    setTemaActual(data.tema || 'CLARO');
  };

  useEffect(() => {
    const fetchData = async () => {
      await cargarTema();
      const data = await apiGet('/cursos');
      setCursos(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = temaActual === 'OSCURO' ? '#121212' : '#f5f5f5';
  }, [temaActual]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
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
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          color: isDark ? '#fff' : '#1a1a1a',
          marginBottom: '0.5rem'
        }}>
          Mis Cursos
        </h1>
        <p style={{
          color: isDark ? '#888' : '#666',
          fontSize: '0.9rem'
        }}>
          Explora y accede a tus cursos disponibles
        </p>
      </div>

      {cursos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: isDark ? '#1e1e1e' : 'white',
          borderRadius: '16px',
          color: isDark ? '#aaa' : '#666',
          border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
        }}>
          No hay cursos disponibles
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {cursos.map((curso) => (
            <div
              key={curso.id}
              onClick={() => router.push(`/cliente/cursos/${curso.id}`)}
              style={{
                cursor: 'pointer',
                backgroundColor: isDark ? '#1e1e1e' : 'white',
                borderRadius: '16px',
                padding: '1.25rem',
                border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = isDark ? '0 8px 20px rgba(0,0,0,0.3)' : '0 8px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark ? '#333' : '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: isDark ? '#fff' : '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                {curso.nombre}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: isDark ? '#aaa' : '#666',
                marginBottom: '0.25rem'
              }}>
                Profesor: {curso.profesor || 'No asignado'}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: isDark ? '#aaa' : '#666',
                marginBottom: '1rem'
              }}>
                {curso.total_videos || 0} videos
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: isDark ? '#2563eb20' : '#eff6ff',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '20px',
                  color: '#2563eb',
                  fontWeight: '500',
                  fontSize: '0.75rem'
                }}>
                  <span>★</span>
                  <span>{curso.calificacion_promedio || 0}</span>
                </div>
                <div style={{
                  color: '#2563eb',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  Acceder →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}