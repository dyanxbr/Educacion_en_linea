'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';

export default function ProgresoPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<any[]>([]);

  const getUsuarioId = () => {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token!.split('.')[1]));
    return payload.id;
  };

  useEffect(() => {
    const fetchProgreso = async () => {
      const usuarioId = getUsuarioId();
      const todosCursos = await apiGet('/cursos');
      
      const cursosConProgreso = await Promise.all(
        todosCursos.map(async (curso: any) => {
          const progreso = await apiGet(`/progreso/curso/${curso.id}?usuario_id=${usuarioId}`);
          return { ...curso, ...progreso };
        })
      );
      setCursos(cursosConProgreso);
    };
    fetchProgreso();
  }, []);

  return (
    <div>
      <h1>Mi Progreso</h1>
      <ul>
        {cursos.map(curso => (
          <li key={curso.id} onClick={() => router.push(`/cliente/cursos/${curso.id}`)} style={{ cursor: 'pointer' }}>
            <strong>{curso.nombre}</strong> - {curso.videos_vistos}/{curso.total_videos} videos ({curso.porcentaje}%)
            {curso.completado && ' ✅ Completado'}
          </li>
        ))}
      </ul>
    </div>
  );
}