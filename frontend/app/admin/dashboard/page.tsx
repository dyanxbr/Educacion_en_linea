'use client';

import { useEffect, useState } from 'react';

interface Resumen {
  totalUsuarios: number;
  totalCursos: number;
  totalProfesores: number;
  totalVisualizaciones: number;
  totalCertificados: number;
}

export default function DashboardPage() {
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('educacionenlinea-production.up.railway.app /reportes/resumen', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setResumen(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando estadísticas...</div>;
  }

  const cards = [
    { titulo: 'Usuarios', valor: resumen?.totalUsuarios || 0, color: '#3b82f6', icono: '👥' },
    { titulo: 'Cursos', valor: resumen?.totalCursos || 0, color: '#10b981', icono: '📚' },
    { titulo: 'Profesores', valor: resumen?.totalProfesores || 0, color: '#f59e0b', icono: '👨‍🏫' },
    { titulo: 'Visualizaciones', valor: resumen?.totalVisualizaciones || 0, color: '#8b5cf6', icono: '👁️' },
    { titulo: 'Certificados', valor: resumen?.totalCertificados || 0, color: '#ec489a', icono: '🎓' }
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1e293b' }}>
        Dashboard
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {cards.map((card, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${card.color}`
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.icono}</div>
            <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>{card.titulo}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{card.valor}</p>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Bienvenido al Panel de Administración</h2>
        <p>Desde aquí puedes gestionar profesores, cursos, ver estadísticas y más.</p>
      </div>
    </div>
  );
}