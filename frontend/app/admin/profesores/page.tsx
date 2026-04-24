'use client';

import { useEffect, useState } from 'react';

interface Profesor {
  id: number;
  nombre: string;
  correo: string;
  especialidad: string;
}

export default function ProfesoresPage() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfesores = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/profesores', {
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

  const crearProfesor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/profesores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, correo, especialidad })
      });

      if (res.ok) {
        setNombre('');
        setCorreo('');
        setEspecialidad('');
        fetchProfesores();
      } else {
        const data = await res.json();
        setError(data.error || 'Error al crear profesor');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  const eliminarProfesor = async (id: number) => {
    if (!confirm('¿Eliminar este profesor?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/profesores/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProfesores();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  if (loading) return <div>Cargando profesores...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Profesores</h1>

      {/* Formulario crear */}
      <form onSubmit={crearProfesor} style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Nuevo Profesor</h2>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          <input
            type="text"
            placeholder="Especialidad"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' }}
          />
        </div>
        <button type="submit" style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Crear Profesor
        </button>
      </form>

      {/* Lista de profesores */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Correo</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Especialidad</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>{p.id}</td>
                <td style={{ padding: '0.75rem' }}>{p.nombre}</td>
                <td style={{ padding: '0.75rem' }}>{p.correo || '-'}</td>
                <td style={{ padding: '0.75rem' }}>{p.especialidad || '-'}</td>
                <td style={{ padding: '0.75rem' }}>
                  <button
                    onClick={() => eliminarProfesor(p.id)}
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