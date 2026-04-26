'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function ReportesPage() {
  const [cursos, setCursos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiGet('/reportes/cursos-populares');
      setCursos(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Cursos Más Populares</h1>
      <table border={1}>
        <thead><tr><th>Curso</th><th>Profesor</th><th>Calificaciones</th><th>Promedio</th><th>Usuarios</th></tr></thead>
        <tbody>
          {cursos.map(c => (
            <tr key={c.id}>
              <td>{c.curso}</td>
              <td>{c.profesor}</td>
              <td>{c.total_calificaciones}</td>
              <td>{c.promedio}★</td>
              <td>{c.usuarios_unicos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}