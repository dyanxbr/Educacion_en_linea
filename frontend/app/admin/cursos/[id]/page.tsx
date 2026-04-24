'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Video {
  id: number;
  titulo: string;
  url_video: string;
  orden: number;
}

export default function EditarCursoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [curso, setCurso] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [tituloVideo, setTituloVideo] = useState('');
  const [ordenVideo, setOrdenVideo] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurso = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/cursos/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCurso(data);
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('titulo', tituloVideo);
    formData.append('curso_id', id as string);
    formData.append('orden', ordenVideo);
    formData.append('video', videoFile);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/videos', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setTituloVideo('');
        setOrdenVideo('');
        setVideoFile(null);
        fetchCurso();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminarVideo = async (videoId: number) => {
    if (!confirm('¿Eliminar este video?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/videos/${videoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCurso();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCurso();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!curso) return <div>Curso no encontrado</div>;

  return (
    <div>
      <button
        onClick={() => router.push('/admin/cursos')}
        style={{
          backgroundColor: '#64748b',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          marginBottom: '1rem',
          cursor: 'pointer'
        }}
      >
        ← Volver a Cursos
      </button>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Editar Curso: {curso.nombre}</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Profesor: {curso.profesor}</p>

      {/* Agregar video */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Agregar Video</h2>
        <form onSubmit={agregarVideo}>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Título del video"
              value={tituloVideo}
              onChange={(e) => setTituloVideo(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
            <input
              type="number"
              placeholder="Orden (1, 2, 3...)"
              value={ordenVideo}
              onChange={(e) => setOrdenVideo(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              style={{ padding: '0.5rem' }}
              required
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
            Subir Video
          </button>
        </form>
      </div>

      {/* Lista de videos */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ padding: '1rem', margin: 0, borderBottom: '1px solid #e2e8f0' }}>Videos del Curso</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Orden</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Título</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>URL</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((v) => (
              <tr key={v.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>{v.orden}</td>
                <td style={{ padding: '0.75rem' }}>{v.titulo}</td>
                <td style={{ padding: '0.75rem' }}>
                  <a href={v.url_video} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>Ver video</a>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <button
                    onClick={() => eliminarVideo(v.id)}
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
            {videos.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No hay videos en este curso. ¡Agrega el primero!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}