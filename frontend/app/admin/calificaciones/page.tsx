'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function CalificacionesPage() {
  const [calificaciones, setCalificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiGet('/calificaciones/admin');
      setCalificaciones(data);
      setLoading(false);
    };
    fetchData();
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
          Calificaciones
        </h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Listado de todas las calificaciones de los cursos
        </p>
      </div>

      {calificaciones.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          color: '#666'
        }}>
          No hay calificaciones registradas
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '600px'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f8f9fa',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#333'
                  }}>Usuario</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#333'
                  }}>Curso</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#333'
                  }}>Puntuación</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#333'
                  }}>Comentario</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#333'
                  }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {calificaciones.map((c, index) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: index === calificaciones.length - 1 ? 'none' : '1px solid #e0e0e0',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td style={{ padding: '1rem', color: '#333' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#2563eb20',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2563eb',
                          fontWeight: '600'
                        }}>
                          {c.usuario?.charAt(0) || '?'}
                        </div>
                        {c.usuario}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#333' }}>{c.curso}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        backgroundColor: '#2563eb10',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '20px',
                        color: '#2563eb',
                        fontWeight: '600'
                      }}>
                        <span>⭐</span>
                        {c.puntuacion}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#666', maxWidth: '300px' }}>
                      <div style={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}>
                        {c.comentario}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#666', fontSize: '0.85rem' }}>
                      {new Date(c.fecha).toLocaleDateString()}
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