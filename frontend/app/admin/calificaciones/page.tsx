'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function CalificacionesPage() {
  const [calificaciones, setCalificaciones] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiGet('/calificaciones/admin');
      setCalificaciones(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Calificaciones</h1>
      <table border={1}>
        <thead><tr><th>Usuario</th><th>Curso</th><th>Puntuación</th><th>Comentario</th><th>Fecha</th></tr></thead>
        <tbody>
          {calificaciones.map(c => (
            <tr key={c.id}>
              <td>{c.usuario}</td>
              <td>{c.curso}</td>
              <td>{c.puntuacion}★</td>
              <td>{c.comentario}</td>
              <td>{new Date(c.fecha).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}