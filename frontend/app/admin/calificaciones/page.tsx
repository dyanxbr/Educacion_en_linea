'use client';

import { useEffect, useState } from 'react';

interface Calificacion {
  id: number;
  puntuacion: number;
  comentario: string;
  fecha: string;
  usuario: string;
  curso: string;
}

export default function CalificacionesPage() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/calificaciones/admin', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setCalificaciones(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Cargando calificaciones...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Calificaciones</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Todas las calificaciones de los cursos</p>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Usuario</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Curso</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Puntuación</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Comentario</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {calificaciones.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>{c.usuario}</td>
                <td style={{ padding: '0.75rem' }}>{c.curso}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{c.puntuacion} ★</span>
                </td>
                <td style={{ padding: '0.75rem' }}>{c.comentario}</td>
                <td style={{ padding: '0.75rem' }}>{new Date(c.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
            {calificaciones.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No hay calificaciones registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}