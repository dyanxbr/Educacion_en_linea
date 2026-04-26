'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPostFormData, apiDelete } from '@/lib/api';

export default function EditarCursoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [curso, setCurso] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [titulo, setTitulo] = useState('');
  const [orden, setOrden] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const fetchCurso = async () => {
    const data = await apiGet(`/cursos/${id}`);
    setCurso(data);
    setVideos(data.videos || []);
  };

  const agregarVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('curso_id', id as string);
    formData.append('orden', orden);
    formData.append('video', videoFile);

    await apiPostFormData('/videos', formData);
    setTitulo('');
    setOrden('');
    setVideoFile(null);
    fetchCurso();
  };

  const eliminarVideo = async (videoId: number) => {
    if (confirm('¿Eliminar video?')) {
      await apiDelete(`/videos/${videoId}`);
      fetchCurso();
    }
  };

  useEffect(() => {
    fetchCurso();
  }, [id]);

  if (!curso) return <div>Cargando...</div>;

  return (
    <div>
      <button onClick={() => router.push('/admin/cursos')}>← Volver</button>
      <h1>Editar: {curso.nombre}</h1>
      
      <h2>Agregar Video</h2>
      <form onSubmit={agregarVideo}>
        <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <input type="number" placeholder="Orden" value={orden} onChange={(e) => setOrden(e.target.value)} required />
        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} required />
        <button type="submit">Subir Video</button>
      </form>

      <h2>Videos</h2>
      <table border={1}>
        <thead><tr><th>Orden</th><th>Título</th><th>Acciones</th></tr></thead>
        <tbody>
          {videos.map(v => (
            <tr key={v.id}>
              <td>{v.orden}</td>
              <td>{v.titulo}</td>
              <td><button onClick={() => eliminarVideo(v.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}