'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';

interface Video {
  id: number;
  titulo: string;
  url_video: string;
  orden: number;
  visto: boolean;
  bloqueado: boolean;
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
  const [temaActual, setTemaActual] = useState('CLARO');
  const [marcando, setMarcando] = useState(false);

  const getUsuarioId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const calcularBloqueos = (videos: Video[]) => {
    return videos.map((video, index) => {
      let bloqueado = true;
      if (index === 0) bloqueado = false;
      else if (videos[index - 1]?.visto === true) bloqueado = false;
      return { ...video, bloqueado };
    });
  };

  const fetchData = async () => {
    const usuario_id = getUsuarioId();
    if (!usuario_id) return;

    const [cursoData, progresoData, calificaciones, perfilData] = await Promise.all([
      apiGet(`/cursos/${id}`),
      apiGet(`/progreso/curso/${id}?usuario_id=${usuario_id}`),
      apiGet(`/calificaciones/curso/${id}`),
      apiGet(`/usuarios/perfil/${usuario_id}`)
    ]);

    setCurso(cursoData);
    setTemaActual(perfilData.tema || 'CLARO');

    const videosConBloqueo = calcularBloqueos(progresoData.progreso);
    setProgreso({ ...progresoData, progreso: videosConBloqueo });

    const existe = calificaciones.some((c: any) => c.usuario_id === usuario_id);
    setYaCalificado(existe);
  };

  const marcarVisto = async (videoId: number): Promise<boolean> => {
    if (marcando) return false;
    setMarcando(true);

    try {
      const usuario_id = getUsuarioId();
      const response = await apiPost('/progreso/ver-video', { usuario_id, video_id: videoId });

      if (response.mensaje || response.id) {
        // Actualizar estado local inmediatamente sin esperar fetchData
        setProgreso((prev: any) => {
          if (!prev) return prev;
          const videosActualizados = prev.progreso.map((v: Video) =>
            v.id === videoId ? { ...v, visto: true } : v
          );
          const videosConBloqueo = calcularBloqueos(videosActualizados);
          const vistos = videosConBloqueo.filter((v: Video) => v.visto).length;
          const total = videosConBloqueo.length;
          return {
            ...prev,
            progreso: videosConBloqueo,
            videos_vistos: vistos,
            total_videos: total,
            porcentaje: Math.round((vistos / total) * 100),
            completado: vistos === total
          };
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al marcar video como visto:', error);
      return false;
    } finally {
      setMarcando(false);
    }
  };

  const calificarCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    const usuario_id = getUsuarioId();
    const res = await apiPost(`/calificaciones/${usuario_id}/${id}`, { puntuacion, comentario });
    if (res.mensaje) {
      setMostrarCalificacion(false);
      setYaCalificado(true);
      await apiPost('/certificados/generar', { usuario_id, curso_id: id });
      alert('¡Calificación guardada! Certificado generado.');
    } else {
      alert(res.error || 'Error al calificar');
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    document.body.style.backgroundColor = temaActual === 'OSCURO' ? '#121212' : '#f5f5f5';
  }, [temaActual]);

  const handleVerVideo = (video: Video) => {
    if (video.bloqueado) {
      alert('Debes completar el video anterior primero');
      return;
    }
    setVideoActual(video);
    setMostrarModal(true);
  };

  const handleMarcarYCerrar = async () => {
    if (videoActual && !videoActual.visto) {
      const success = await marcarVisto(videoActual.id);
      if (!success) {
        alert('Error al guardar el progreso. Intenta de nuevo.');
        return;
      }
    }
    setMostrarModal(false);
    setVideoActual(null);
  };

  const handleVideoTerminado = async () => {
    if (!videoActual || videoActual.visto) {
      setMostrarModal(false);
      setVideoActual(null);
      return;
    }
    await marcarVisto(videoActual.id);
    setMostrarModal(false);
    setVideoActual(null);
  };

  if (!curso) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{
          width: '40px', height: '40px',
          border: '3px solid #e0e0e0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  const isDark = temaActual === 'OSCURO';

  return (
    <div>
      <button
        onClick={() => router.push('/cliente/cursos')}
        style={{
          backgroundColor: 'transparent', color: '#2563eb', border: 'none',
          padding: '0.5rem 0', marginBottom: '1.5rem', fontSize: '0.9rem',
          fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        ← Volver a cursos
      </button>

      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: isDark ? '#fff' : '#1a1a1a', marginBottom: '0.3rem' }}>
          {curso.nombre}
        </h1>
        <p style={{ color: isDark ? '#888' : '#666', fontSize: '0.85rem' }}>
          Profesor: {curso.profesor || 'No asignado'}
        </p>
      </div>

      {progreso && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.8rem', color: isDark ? '#aaa' : '#666', marginBottom: '0.3rem'
          }}>
            <span>Progreso</span>
            <span>{progreso.videos_vistos} de {progreso.total_videos} videos • {progreso.porcentaje}%</span>
          </div>
          <div style={{ backgroundColor: isDark ? '#333' : '#e0e0e0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progreso.porcentaje}%`, backgroundColor: '#2563eb', height: '100%', borderRadius: '3px' }} />
          </div>

          {progreso.completado && !yaCalificado && (
            <button
              onClick={() => setMostrarCalificacion(true)}
              style={{
                marginTop: '1rem', backgroundColor: 'transparent', color: '#2563eb',
                border: '1px solid #2563eb', padding: '0.4rem 0.9rem', borderRadius: '6px',
                fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#2563eb'; }}
            >
              Calificar Curso
            </button>
          )}
          {yaCalificado && (
            <div style={{ marginTop: '0.75rem', padding: '0.5rem 0', color: '#10b981', fontSize: '0.8rem' }}>
              Curso calificado. Certificado disponible.
            </div>
          )}
        </div>
      )}

      <div style={{
        backgroundColor: isDark ? '#1e1e1e' : 'white',
        borderRadius: '12px', overflow: 'hidden',
        border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
      }}>
        <h2 style={{
          padding: '1rem', margin: 0,
          borderBottom: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
          fontSize: '1rem', fontWeight: '600', color: isDark ? '#fff' : '#333'
        }}>
          Contenido del curso
        </h2>
        <div>
          {progreso?.progreso.map((video: Video, index: number) => (
            <div
              key={video.id}
              onClick={() => handleVerVideo(video)}
              style={{
                padding: '1rem',
                borderBottom: index === progreso.progreso.length - 1 ? 'none' : `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: video.bloqueado ? 'not-allowed' : 'pointer',
                backgroundColor: video.visto
                  ? (isDark ? '#0a3b2a' : '#d1fae5')
                  : (video.bloqueado ? (isDark ? '#2a2a2a' : '#f5f5f5') : 'transparent'),
                opacity: video.bloqueado ? 0.6 : 1,
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: video.visto ? '#10b981' : (video.bloqueado ? (isDark ? '#444' : '#ccc') : '#2563eb'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.8rem', fontWeight: '600'
                }}>
                  {video.visto ? '✓' : index + 1}
                </div>
                <div>
                  <div style={{ fontWeight: video.visto ? 'normal' : '500', color: isDark ? '#fff' : '#333' }}>
                    {video.titulo}
                  </div>
                  {video.bloqueado && !video.visto && (
                    <div style={{ fontSize: '0.7rem', color: isDark ? '#888' : '#999' }}>
                      🔒 Completa el video anterior
                    </div>
                  )}
                  {video.visto && (
                    <div style={{ fontSize: '0.7rem', color: '#10b981' }}>✓ Completado</div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '1.2rem', color: video.bloqueado ? (isDark ? '#555' : '#ccc') : '#2563eb' }}>
                {video.bloqueado ? '🔒' : '▶'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarModal && videoActual && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: '#000', borderRadius: '12px', width: '90%', maxWidth: '1000px', position: 'relative' }}>
            <button
              onClick={handleMarcarYCerrar}
              style={{
                position: 'absolute', top: '-40px', right: '0',
                backgroundColor: 'white', border: 'none', fontSize: '1.2rem',
                cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>
            <video
              key={videoActual.id}
              src={videoActual.url_video}
              controls
              autoPlay
              style={{ width: '100%', borderRadius: '12px' }}
              onEnded={handleVideoTerminado}
            />
            <div style={{
              padding: '1rem', backgroundColor: '#1e1e1e', color: 'white',
              borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h3 style={{ margin: 0 }}>{videoActual.titulo}</h3>
              {!videoActual.visto && (
                <button
                  onClick={handleMarcarYCerrar}
                  disabled={marcando}
                  style={{
                    backgroundColor: 'transparent', color: marcando ? '#555' : '#2563eb',
                    border: `1px solid ${marcando ? '#555' : '#2563eb'}`,
                    padding: '0.4rem 0.8rem', borderRadius: '6px',
                    fontSize: '0.8rem', cursor: marcando ? 'not-allowed' : 'pointer'
                  }}
                >
                  {marcando ? 'Guardando...' : 'Marcar como completado'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {mostrarCalificacion && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1001,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: isDark ? '#1e1e1e' : 'white',
            padding: '1.5rem', borderRadius: '12px', width: '90%', maxWidth: '400px',
            border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: isDark ? '#fff' : '#333' }}>Calificar Curso</h2>
            <form onSubmit={calificarCurso}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: isDark ? '#aaa' : '#666' }}>Puntuación</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button type="button" key={s} onClick={() => setPuntuacion(s)}
                      style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: s <= puntuacion ? '#f59e0b' : (isDark ? '#555' : '#ccc') }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <textarea
                  placeholder="Escribe tu comentario..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '0.75rem',
                    border: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                    borderRadius: '8px', fontSize: '0.85rem',
                    backgroundColor: isDark ? '#2a2a2a' : 'white',
                    color: isDark ? '#fff' : '#333', resize: 'vertical', outline: 'none'
                  }}
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" style={{
                  flex: 1, backgroundColor: '#2563eb', color: 'white',
                  padding: '0.5rem', border: 'none', borderRadius: '6px',
                  fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer'
                }}>Enviar</button>
                <button type="button" onClick={() => setMostrarCalificacion(false)} style={{
                  flex: 1, backgroundColor: 'transparent', color: '#dc2626',
                  border: '1px solid #dc2626', padding: '0.5rem', borderRadius: '6px',
                  fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer'
                }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}