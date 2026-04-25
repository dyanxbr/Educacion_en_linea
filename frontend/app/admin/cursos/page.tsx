'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Curso {
  id: number;
  nombre: string;
  profesor: string;
  total_videos: number;
  calificacion_promedio: number;
}

interface Profesor {
  id: number;
  nombre: string;
}

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [nombre, setNombre] = useState('');
  const [profesorId, setProfesorId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCursos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('educacionenlinea-production.up.railway.app/cursos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCursos(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchProfesores = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('educacionenlinea-production.up.railway.app/profesores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProfesores(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const crearCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch('educacionenlinea-production.up.railway.app/cursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, profesor_id: parseInt(profesorId) })
      });
      setNombre('');
      setProfesorId('');
      fetchCursos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminarCurso = async (id: number) => {
    if (!confirm('¿Eliminar este curso y todos sus videos?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`educacionenlinea-production.up.railway.app/cursos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCursos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCursos();
    fetchProfesores();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Cursos</h1>

      <form onSubmit={crearCurso} style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Nuevo Curso</h2>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Nombre del curso"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
          <select
            value={profesorId}
            onChange={(e) => setProfesorId(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          >
            <option value="">Selecciona un profesor</option>
            {profesores.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Crear Curso
        </button>
      </form>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Curso</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Profesor</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Videos</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Promedio</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>{c.id}</td>
                <td style={{ padding: '0.75rem' }}>{c.nombre}</td>
                <td style={{ padding: '0.75rem' }}>{c.profesor}</td>
                <td style={{ padding: '0.75rem' }}>{c.total_videos}</td>
                <td style={{ padding: '0.75rem' }}>{c.calificacion_promedio} ★</td>
                <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => router.push(`/admin/cursos/${c.id}`)}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarCurso(c.id)}
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}