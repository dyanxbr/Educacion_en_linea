'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function VisualizacionesPage() {
  const [visualizaciones, setVisualizaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiGet('/reportes/visualizaciones');
      setVisualizaciones(data);
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

  const totalVisualizaciones = visualizaciones.reduce((sum, v) => sum + (v.total_visualizaciones || 0), 0);
  const totalVideos = visualizaciones.length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '0.5rem'
        }}>
          Visualizaciones
        </h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Estadísticas de reproducción de videos
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>Total visualizaciones</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' }}>
            {totalVisualizaciones.toLocaleString()}
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>Videos con visualizaciones</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>
            {totalVideos}
          </div>
        </div>
      </div>

      {visualizaciones.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          color: '#666'
        }}>
          No hay visualizaciones registradas
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
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Video</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Curso</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#333' }}>Total visualizaciones</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#333' }}>Usuarios únicos</th>
                </tr>
              </thead>
              <tbody>
                {visualizaciones.map((v, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: index === visualizaciones.length - 1 ? 'none' : '1px solid #e0e0e0',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td style={{ padding: '1rem', fontWeight: '500', color: '#333' }}>
                      {v.video}
                    </td>
                    <td style={{ padding: '1rem', color: '#666' }}>
                      {v.curso}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#2563eb10',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '20px',
                        color: '#2563eb',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}>
                        {v.total_visualizaciones || 0}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                      {v.usuarios_unicos || 0}
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