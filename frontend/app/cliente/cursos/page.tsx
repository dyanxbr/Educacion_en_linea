'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<any[]>([]);

  useEffect(() => {
    const fetchCursos = async () => {
      const data = await apiGet('/cursos');
      setCursos(data);
    };
    fetchCursos();
  }, []);

  return (
    <div>
      <h1>Mis Cursos</h1>
      <ul>
        {cursos.map(curso => (
          <li key={curso.id} onClick={() => router.push(`/cliente/cursos/${curso.id}`)} style={{ cursor: 'pointer', margin: '10px 0' }}>
            <strong>{curso.nombre}</strong> - {curso.profesor} - {curso.total_videos} videos - {curso.calificacion_promedio}★
          </li>
        ))}
      </ul>
    </div>
  );
}