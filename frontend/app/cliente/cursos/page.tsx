'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Curso {
  id: number;
  nombre: string;
  profesor: string;
  especialidad: string;
  total_videos: number;
  calificacion_promedio: number;
}

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/cursos', {
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

  const cursosFiltrados = cursos.filter(curso =>
    curso.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (curso.profesor && curso.profesor.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando cursos...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Mis Cursos</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Selecciona un curso para comenzar a aprender</p>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar curso por nombre o profesor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '1rem'
        }}
      />

      {/* Grid de cursos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {cursosFiltrados.map((curso) => (
          <div
            key={curso.id}
            onClick={() => router.push(`/cliente/cursos/${curso.id}`)}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: '1px solid #e2e8f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{curso.nombre}</h2>
            <p style={{ color: '#64748b', marginBottom: '0.3rem' }}>👨‍🏫 {curso.profesor || 'Sin profesor'}</p>
            <p style={{ color: '#64748b', marginBottom: '0.3rem' }}>📹 {curso.total_videos} videos</p>
            <p style={{ fontWeight: 'bold', color: '#f59e0b' }}>{curso.calificacion_promedio} ★</p>
          </div>
        ))}
      </div>

      {cursosFiltrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          No se encontraron cursos
        </div>
      )}
    </div>
  );
}