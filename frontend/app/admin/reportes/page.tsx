'use client';

import { useEffect, useState } from 'react';

interface CursoPopular {
  id: number;
  curso: string;
  profesor: string;
  total_calificaciones: number;
  promedio: number;
  usuarios_unicos: number;
}

export default function ReportesPage() {
  const [cursos, setCursos] = useState<CursoPopular[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('educacionenlinea-production.up.railway.app/reportes/cursos-populares', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setCursos(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Cargando reportes...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Cursos Más Populares</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Ranking de cursos por calificación y participación</p>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>#</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Curso</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Profesor</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Calificaciones</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Promedio</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Usuarios</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((c, index) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && index + 1}
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{c.curso}</td>
                <td style={{ padding: '0.75rem' }}>{c.profesor || '-'}</td>
                <td style={{ padding: '0.75rem' }}>{c.total_calificaciones}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{c.promedio} ★</span>
                </td>
                <td style={{ padding: '0.75rem' }}>{c.usuarios_unicos}</td>
              </tr>
            ))}
            {cursos.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No hay datos suficientes para mostrar el ranking</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}