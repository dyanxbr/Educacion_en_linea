'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function VisualizacionesPage() {
  const [visualizaciones, setVisualizaciones] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiGet('/reportes/visualizaciones');
      setVisualizaciones(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Visualizaciones</h1>
      <table border={1}>
        <thead><tr><th>Video</th><th>Curso</th><th>Total Visualizaciones</th><th>Usuarios Únicos</th></tr></thead>
        <tbody>
          {visualizaciones.map((v, i) => (
            <tr key={i}>
              <td>{v.video}</td>
              <td>{v.curso}</td>
              <td>{v.total_visualizaciones}</td>
              <td>{v.usuarios_unicos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}