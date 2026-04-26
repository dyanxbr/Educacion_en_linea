'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost, apiDelete } from '@/lib/api';

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<any[]>([]);
  const [profesores, setProfesores] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [profesorId, setProfesorId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCursos = async () => {
    const data = await apiGet('/cursos');
    setCursos(data);
    setLoading(false);
  };

  const fetchProfesores = async () => {
    const data = await apiGet('/profesores');
    setProfesores(data);
  };

  const crearCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !profesorId) return;
    await apiPost('/cursos', { nombre, profesor_id: parseInt(profesorId) });
    setNombre('');
    setProfesorId('');
    fetchCursos();
  };

  const eliminarCurso = async (id: number) => {
    if (confirm('¿Eliminar este curso?')) {
      await apiDelete(`/cursos/${id}`);
      fetchCursos();
    }
  };

  useEffect(() => {
    fetchCursos();
    fetchProfesores();
  }, []);

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

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '0.5rem'
        }}>
          Cursos
        </h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Gestiona los cursos disponibles en la plataforma
        </p>
      </div>

      <form onSubmit={crearCurso} style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '1.25rem'
        }}>
          Nuevo curso
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: '1rem',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Nombre del curso
            </label>
            <input
              type="text"
              placeholder="Nombre del curso"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Profesor
            </label>
            <select
              value={profesorId}
              onChange={(e) => setProfesorId(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                backgroundColor: 'white',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">Seleccionar profesor</option>
              {profesores.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              height: '42px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Crear curso
          </button>
        </div>
      </form>

      {cursos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          color: '#666'
        }}>
          No hay cursos registrados
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '700px'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Curso</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Profesor</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#333' }}>Videos</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#333' }}>Promedio</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#333' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((c, index) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: index === cursos.length - 1 ? 'none' : '1px solid #e0e0e0',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td style={{ padding: '1rem', color: '#666' }}>{c.id}</td>
                    <td style={{ padding: '1rem', fontWeight: '500', color: '#333' }}>{c.nombre}</td>
                    <td style={{ padding: '1rem', color: '#666' }}>
                      <span style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem'
                      }}>
                        {c.profesor || 'Sin asignar'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                      {c.total_videos || 0}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        backgroundColor: '#2563eb10',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '20px',
                        color: '#2563eb',
                        fontWeight: '500',
                        fontSize: '0.85rem'
                      }}>
                        <span>⭐</span>
                        {c.calificacion_promedio || 0}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => router.push(`/admin/cursos/${c.id}`)}
                          style={{
                            backgroundColor: 'transparent',
                            color: '#2563eb',
                            border: 'none',
                            padding: '0.4rem 0.9rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb10'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarCurso(c.id)}
                          style={{
                            backgroundColor: 'transparent',
                            color: '#dc2626',
                            border: 'none',
                            padding: '0.4rem 0.9rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc262610'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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