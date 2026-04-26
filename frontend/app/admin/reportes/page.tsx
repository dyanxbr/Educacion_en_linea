'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function ReportesPage() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiGet('/reportes/cursos-populares');
      setCursos(data);
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

  const topCurso = cursos[0];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '0.5rem'
        }}>
          Cursos más populares
        </h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Ranking de cursos por calificación y participación
        </p>
      </div>

      {topCurso && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{
                fontSize: '0.85rem',
                color: '#2563eb',
                fontWeight: '600',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Curso destacado 🏆
              </div>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '0.3rem'
              }}>
                {topCurso.curso}
              </div>
              <div style={{ color: '#666', fontSize: '0.85rem' }}>
                {topCurso.profesor || 'Sin profesor asignado'}
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#f59e0b'
                }}>
                  {topCurso.promedio || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>⭐ Promedio</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#2563eb'
                }}>
                  {topCurso.total_calificaciones || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Calificaciones</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#8b5cf6'
                }}>
                  {topCurso.usuarios_unicos || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Estudiantes únicos</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {cursos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          color: '#666'
        }}>
          No hay datos suficientes para mostrar el ranking
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
              minWidth: '500px'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>#</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Curso</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Profesor</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#333' }}>Calificaciones</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#333' }}>Promedio</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#333' }}>Estudiantes</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((curso, index) => {
                  let medal = '';
                  if (index === 0) medal = '🥇';
                  else if (index === 1) medal = '🥈';
                  else if (index === 2) medal = '🥉';
                  
                  return (
                    <tr
                      key={curso.id}
                      style={{
                        borderBottom: index === cursos.length - 1 ? 'none' : '1px solid #e0e0e0',
                        transition: 'background-color 0.2s',
                        backgroundColor: index < 3 ? '#fefce8' : 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = index < 3 ? '#fef3c7' : '#fafafa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index < 3 ? '#fefce8' : 'white'}
                    >
                      <td style={{ padding: '1rem', fontWeight: '600', fontSize: '1.1rem' }}>
                        {medal || index + 1}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '500', color: '#333' }}>
                        {curso.curso}
                      </td>
                      <td style={{ padding: '1rem', color: '#666' }}>
                        {curso.profesor || '—'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                        {curso.total_calificaciones || 0}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          backgroundColor: '#fef3c7',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '20px',
                          color: '#d97706',
                          fontWeight: '600',
                          fontSize: '0.85rem'
                        }}>
                          <span>⭐</span>
                          {curso.promedio || 0}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                        {curso.usuarios_unicos || 0}
                      </td>
                    </tr>
                  );
                })}
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