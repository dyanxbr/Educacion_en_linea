'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CursoProgreso {
  id: number;
  nombre: string;
  profesor: string;
  total_videos: number;
  videos_vistos: number;
  porcentaje: number;
  completado: boolean;
}

export default function ProgresoPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<CursoProgreso[]>([]);
  const [loading, setLoading] = useState(true);

  const getUsuarioId = (): number | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchProgreso = async () => {
      try {
        const token = localStorage.getItem('token');
        const usuarioId = getUsuarioId();

        // Obtener todos los cursos
        const resCursos = await fetch('http://localhost:3000/cursos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const todosCursos = await resCursos.json();

        // Obtener progreso de cada curso
        const cursosConProgreso = await Promise.all(
          todosCursos.map(async (curso: any) => {
            const resProgreso = await fetch(`http://localhost:3000/progreso/curso/${curso.id}?usuario_id=${usuarioId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const progreso = await resProgreso.json();
            return {
              id: curso.id,
              nombre: curso.nombre,
              profesor: curso.profesor,
              total_videos: progreso.total_videos,
              videos_vistos: progreso.videos_vistos,
              porcentaje: progreso.porcentaje,
              completado: progreso.completado
            };
          })
        );

        setCursos(cursosConProgreso);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgreso();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando progreso...</div>;

  const cursosCompletados = cursos.filter(c => c.completado);
  const cursosEnProgreso = cursos.filter(c => !c.completado && c.total_videos > 0);
  const cursosSinIniciar = cursos.filter(c => c.total_videos === 0);

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Mi Progreso</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Seguimiento de tu avance en los cursos</p>

      {/* Estadísticas rápidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '1.5rem' }}>📚</div>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{cursos.length}</div>
          <div style={{ color: '#64748b' }}>Total Cursos</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '1.5rem' }}>✅</div>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#10b981' }}>{cursosCompletados.length}</div>
          <div style={{ color: '#64748b' }}>Completados</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '1.5rem' }}>📖</div>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#f59e0b' }}>{cursosEnProgreso.length}</div>
          <div style={{ color: '#64748b' }}>En Progreso</div>
        </div>
      </div>

      {/* Cursos completados */}
      {cursosCompletados.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#10b981' }}>✅ Cursos Completados</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {cursosCompletados.map((curso) => (
              <div
                key={curso.id}
                onClick={() => router.push(`/cliente/cursos/${curso.id}`)}
                style={{
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  border: '1px solid #bbf7d0'
                }}
              >
                <h3 style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{curso.nombre}</h3>
                <p style={{ color: '#64748b', marginBottom: '0.3rem' }}>👨‍🏫 {curso.profesor || 'Sin profesor'}</p>
                <div style={{ marginTop: '0.5rem', color: '#10b981' }}>🎉 100% completado</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cursos en progreso */}
      {cursosEnProgreso.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f59e0b' }}>📖 Cursos en Progreso</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {cursosEnProgreso.map((curso) => (
              <div
                key={curso.id}
                onClick={() => router.push(`/cliente/cursos/${curso.id}`)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{curso.nombre}</h3>
                <p style={{ color: '#64748b', marginBottom: '0.3rem' }}>👨‍🏫 {curso.profesor || 'Sin profesor'}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span>Progreso</span>
                    <span>{curso.videos_vistos} / {curso.total_videos} videos</span>
                  </div>
                  <div style={{
                    backgroundColor: '#e2e8f0',
                    height: '8px',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${curso.porcentaje}%`,
                      backgroundColor: '#f59e0b',
                      height: '100%'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cursos sin iniciar */}
      {cursosSinIniciar.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#64748b' }}>📌 Cursos sin Iniciar</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {cursosSinIniciar.map((curso) => (
              <div
                key={curso.id}
                onClick={() => router.push(`/cliente/cursos/${curso.id}`)}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  border: '1px dashed #ccc'
                }}
              >
                <h3 style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{curso.nombre}</h3>
                <p style={{ color: '#64748b', marginBottom: '0.3rem' }}>👨‍🏫 {curso.profesor || 'Sin profesor'}</p>
                <div style={{ marginTop: '0.5rem', color: '#64748b' }}>📹 Sin videos aún</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cursos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No hay cursos disponibles</p>
        </div>
      )}
    </div>
  );
}