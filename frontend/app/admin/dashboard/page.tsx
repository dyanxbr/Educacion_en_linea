'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function DashboardPage() {
  const [resumen, setResumen] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiGet('/reportes/resumen');
      setResumen(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {resumen && (
        <div>
          <p>Usuarios: {resumen.totalUsuarios}</p>
          <p>Cursos: {resumen.totalCursos}</p>
          <p>Profesores: {resumen.totalProfesores}</p>
          <p>Visualizaciones: {resumen.totalVisualizaciones}</p>
          <p>Certificados: {resumen.totalCertificados}</p>
        </div>
      )}
    </div>
  );
}