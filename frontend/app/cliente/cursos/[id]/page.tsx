'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';

interface Video {
  id: number;
  titulo: string;
  url_video: string;
  orden: number;
  visto: boolean;
}

export default function CursoDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [curso, setCurso] = useState<any>(null);
  const [progreso, setProgreso] = useState<any>(null);
  const [videoActual, setVideoActual] = useState<Video | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarCalificacion, setMostrarCalificacion] = useState(false);
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [yaCalificado, setYaCalificado] = useState(false);

  const getUsuarioId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  };

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const usuario_id = getUsuarioId();

    const cursoData = await apiGet(`/cursos/${id}`);
    setCurso(cursoData);

    const progresoData = await apiGet(`/progreso/curso/${id}?usuario_id=${usuario_id}`);
    setProgreso(progresoData);

    // Verificar si ya calificó
    const calificaciones = await apiGet(`/calificaciones/curso/${id}`);
    const existe = calificaciones.some((c: any) => c.usuario_id === usuario_id);
    setYaCalificado(existe);
  };

  const marcarVisto = async (videoId: number) => {
    const usuario_id = getUsuarioId();
    await apiPost('/progreso/ver-video', { usuario_id, video_id: videoId });
    fetchData();
  };

  const calificarCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    const usuario_id = getUsuarioId();
    const res = await apiPost(`/calificaciones/${usuario_id}/${id}`, { puntuacion, comentario });
    if (res.mensaje) {
      setMostrarCalificacion(false);
      setYaCalificado(true);
      // Generar certificado
      await apiPost('/certificados/generar', { usuario_id, curso_id: id });
      alert('¡Calificación guardada! Certificado generado.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleVerVideo = (video: Video) => {
    setVideoActual(video);
    setMostrarModal(true);
  };

  const handleCerrarVideo = async () => {
    if (videoActual && !videoActual.visto) {
      await marcarVisto(videoActual.id);
    }
    setMostrarModal(false);
    setVideoActual(null);
  };

  if (!curso) return <div>Cargando...</div>;

  return (
    <div>
      <button onClick={() => router.push('/cliente/cursos')}>← Volver</button>
      <h1>{curso.nombre}</h1>
      <p>Profesor: {curso.profesor}</p>

      {progreso && (
        <div>
          <p>Progreso: {progreso.videos_vistos} / {progreso.total_videos} videos ({progreso.porcentaje}%)</p>
          <progress value={progreso.porcentaje} max={100} />
          {progreso.completado && !yaCalificado && (
            <button onClick={() => setMostrarCalificacion(true)}>⭐ Calificar Curso</button>
          )}
          {yaCalificado && <p>✅ Curso calificado. Certificado disponible.</p>}
        </div>
      )}

      <h2>Videos</h2>
      <ul>
        {progreso?.progreso.map((video: Video, idx: number) => (
          <li key={video.id} onClick={() => handleVerVideo(video)} style={{ cursor: 'pointer' }}>
            {video.visto ? '✅' : '▶️'} {video.titulo}
          </li>
        ))}
      </ul>

      {mostrarModal && videoActual && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000 }}>
          <div style={{ margin: '50px auto', maxWidth: '800px' }}>
            <button onClick={handleCerrarVideo}>Cerrar</button>
            <video src={videoActual.url_video} controls autoPlay style={{ width: '100%' }} onEnded={handleCerrarVideo} />
          </div>
        </div>
      )}

      {mostrarCalificacion && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
          <div style={{ margin: '100px auto', maxWidth: '400px', backgroundColor: 'white', padding: '20px' }}>
            <h2>Calificar Curso</h2>
            <form onSubmit={calificarCurso}>
              <div>Puntuación: {[1,2,3,4,5].map(s => (
                <button type="button" key={s} onClick={() => setPuntuacion(s)} style={{ fontSize: '24px', background: 'none', border: 'none', color: s <= puntuacion ? 'gold' : 'gray' }}>★</button>
              ))}</div>
              <textarea placeholder="Comentario" value={comentario} onChange={(e) => setComentario(e.target.value)} required />
              <button type="submit">Enviar Calificación</button>
              <button type="button" onClick={() => setMostrarCalificacion(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}