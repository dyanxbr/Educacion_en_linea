'use client';

import { useEffect, useState } from 'react';

interface Visualizacion {
  video: string;
  curso: string;
  total_visualizaciones: number;
  usuarios_unicos: number;
}

export default function VisualizacionesPage() {
  const [visualizaciones, setVisualizaciones] = useState<Visualizacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('educacionenlinea-production.up.railway.app/reportes/visualizaciones', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setVisualizaciones(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Cargando estadísticas...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Visualizaciones</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Estadísticas de reproducción de videos</p>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Video</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Curso</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Total Visualizaciones</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Usuarios Únicos</th>
            </tr>
          </thead>
          <tbody>
            {visualizaciones.map((v, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>{v.video}</td>
                <td style={{ padding: '0.75rem' }}>{v.curso}</td>
                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#3b82f6' }}>{v.total_visualizaciones}</td>
                <td style={{ padding: '0.75rem' }}>{v.usuarios_unicos}</td>
              </tr>
            ))}
            {visualizaciones.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>No hay visualizaciones registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}