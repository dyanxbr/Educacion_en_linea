'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';

export default function ProgresoPage() {
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
    const fetchProgreso = async () => {
      const usuarioId = getUsuarioId();
      await cargarTema();
      
      const todosCursos = await apiGet('/cursos');
      
      const cursosConProgreso = await Promise.all(
        todosCursos.map(async (curso: any) => {
          const progreso = await apiGet(`/progreso/curso/${curso.id}?usuario_id=${usuarioId}`);
          return { ...curso, ...progreso };
        })
      );
      setCursos(cursosConProgreso);
      setLoading(false);
    };
    fetchProgreso();
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
  const cursosCompletados = cursos.filter(c => c.completado === true);
  const cursosEnProgreso = cursos.filter(c => c.completado !== true && c.total_videos > 0);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          color: isDark ? '#fff' : '#1a1a1a',
          marginBottom: '0.5rem'
        }}>
          Mi Progreso
        </h1>
        <p style={{
          color: isDark ? '#888' : '#666',
          fontSize: '0.9rem'
        }}>
          {cursosCompletados.length} cursos completados • {cursosEnProgreso.length} cursos en progreso
        </p>
      </div>

      {cursosCompletados.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#10b981',
            marginBottom: '1rem'
          }}>
            Cursos completados
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cursosCompletados.map(curso => (
              <div
                key={curso.id}
                onClick={() => router.push(`/cliente/cursos/${curso.id}`)}
                style={{
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  borderBottom: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#1a1a1a'}
              >
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  {curso.nombre}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                  Completado
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cursosEnProgreso.length > 0 && (
        <div>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#f59e0b',
            marginBottom: '1rem'
          }}>
            Cursos en progreso
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cursosEnProgreso.map(curso => (
              <div
                key={curso.id}
                onClick={() => router.push(`/cliente/cursos/${curso.id}`)}
                style={{
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  fontWeight: '500',
                  color: isDark ? '#fff' : '#1a1a1a',
                  marginBottom: '0.25rem'
                }}>
                  {curso.nombre}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: isDark ? '#aaa' : '#666',
                  marginBottom: '0.25rem'
                }}>
                  <span>Progreso</span>
                  <span>{curso.videos_vistos} / {curso.total_videos} videos</span>
                </div>
                <div style={{
                  backgroundColor: isDark ? '#333' : '#e0e0e0',
                  height: '4px',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${curso.porcentaje}%`,
                    backgroundColor: '#f59e0b',
                    height: '100%',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cursos.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: isDark ? '#aaa' : '#666'
        }}>
          No hay cursos disponibles
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