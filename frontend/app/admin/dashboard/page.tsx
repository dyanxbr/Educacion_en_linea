'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function DashboardPage() {
  const [resumen, setResumen] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [temaActual, setTemaActual] = useState('CLARO');

  const getUsuarioId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  };

  const cargarTema = async () => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return;
    const data = await apiGet(`/usuarios/perfil/${usuarioId}`);
    setTemaActual(data.tema || 'CLARO');
  };

  useEffect(() => {
    const fetchData = async () => {
      await cargarTema();
      const data = await apiGet('/reportes/resumen');
      setResumen(data);
      setLoading(false);
    };
    fetchData();
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

  const cards = [
    {
      titulo: 'Usuarios',
      valor: resumen?.totalUsuarios || 0,
      color: '#2563eb',
    },
    {
      titulo: 'Cursos',
      valor: resumen?.totalCursos || 0,
      color: '#10b981',
    },
    {
      titulo: 'Profesores',
      valor: resumen?.totalProfesores || 0,
      color: '#f59e0b',
    },
    {
      titulo: 'Visualizaciones',
      valor: resumen?.totalVisualizaciones || 0,
      color: '#8b5cf6',
    },
    {
      titulo: 'Certificados',
      valor: resumen?.totalCertificados || 0,
      color: '#ec489a',
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          color: isDark ? '#fff' : '#1a1a1a',
          marginBottom: '0.5rem'
        }}>
          Dashboard
        </h1>
        <p style={{
          color: isDark ? '#888' : '#666',
          fontSize: '0.9rem'
        }}>
          Resumen general de la plataforma
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              backgroundColor: isDark ? '#1e1e1e' : 'white',
              borderRadius: '16px',
              padding: '1.25rem',
              border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = isDark ? '#333' : '#e0e0e0';
            }}
          >
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              color: card.color,
              marginBottom: '0.5rem',
              letterSpacing: '0.5px'
            }}>
              {card.titulo.toUpperCase()}
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: isDark ? '#fff' : '#1a1a1a'
            }}>
              {card.valor.toLocaleString()}
            </div>
            <div style={{
              marginTop: '0.75rem',
              height: '2px',
              backgroundColor: isDark ? '#333' : '#e0e0e0',
              borderRadius: '1px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '40%',
                height: '100%',
                backgroundColor: card.color,
                borderRadius: '1px'
              }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: isDark ? '#1e1e1e' : 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
      }}>
        <h2 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: isDark ? '#fff' : '#333',
          marginBottom: '0.5rem'
        }}>
          Bienvenido al panel de administración
        </h2>
        <p style={{
          color: isDark ? '#aaa' : '#666',
          fontSize: '0.85rem',
          lineHeight: '1.5'
        }}>
          Desde aquí puedes gestionar profesores, cursos, visualizaciones, calificaciones y reportes.
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}