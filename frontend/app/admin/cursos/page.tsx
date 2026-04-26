'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost, apiDelete } from '@/lib/api';

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<any[]>([]);
  const [profesores, setProfesores] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [profesorId, setProfesorId] = useState('');

  const fetchCursos = async () => {
    const data = await apiGet('/cursos');
    setCursos(data);
  };

  const fetchProfesores = async () => {
    const data = await apiGet('/profesores');
    setProfesores(data);
  };

  const crearCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiPost('/cursos', { nombre, profesor_id: parseInt(profesorId) });
    setNombre('');
    setProfesorId('');
    fetchCursos();
  };

  const eliminarCurso = async (id: number) => {
    if (confirm('¿Eliminar?')) {
      await apiDelete(`/cursos/${id}`);
      fetchCursos();
    }
  };

  useEffect(() => {
    fetchCursos();
    fetchProfesores();
  }, []);

  return (
    <div>
      <h1>Cursos</h1>
      <form onSubmit={crearCurso}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <select value={profesorId} onChange={(e) => setProfesorId(e.target.value)} required>
          <option value="">Seleccionar Profesor</option>
          {profesores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <button type="submit">Crear Curso</button>
      </form>
      <table border={1}>
        <thead>
          <tr><th>ID</th><th>Curso</th><th>Profesor</th><th>Videos</th><th>Promedio</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {cursos.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.profesor}</td>
              <td>{c.total_videos}</td>
              <td>{c.calificacion_promedio}★</td>
              <td>
                <button onClick={() => router.push(`/admin/cursos/${c.id}`)}>Editar</button>
                <button onClick={() => eliminarCurso(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}