'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';

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

  const fetchProfesores = async () => {
    const data = await apiGet('/profesores');
    setProfesores(data);
  };

  const crearProfesor = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiPost('/profesores', { nombre, correo, especialidad });
    setNombre('');
    setCorreo('');
    setEspecialidad('');
    fetchProfesores();
  };

  const eliminarProfesor = async (id: number) => {
    if (confirm('¿Eliminar?')) {
      await apiDelete(`/profesores/${id}`);
      fetchProfesores();
    }
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  return (
    <div>
      <h1>Profesores</h1>
      <form onSubmit={crearProfesor}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <input type="text" placeholder="Especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} />
        <button type="submit">Crear</button>
      </form>
      <table border={1}>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Especialidad</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {profesores.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.correo}</td>
              <td>{p.especialidad}</td>
              <td><button onClick={() => eliminarProfesor(p.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}