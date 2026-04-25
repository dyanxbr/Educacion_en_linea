'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Video {
  id: number;
  titulo: string;
  url_video: string;
  orden: number;
  visto: boolean;
}

interface Progreso {
  progreso: Video[];
  total_videos: number;
  videos_vistos: number;
  porcentaje: number;
  completado: boolean;
}

export default function CursoDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [curso, setCurso] = useState<any>(null);
  const [progreso, setProgreso] = useState<Progreso | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoActual, setVideoActual] = useState<Video | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Estados para calificación
  const [mostrarModalCalificacion, setMostrarModalCalificacion] = useState(false);
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [calificando, setCalificando] = useState(false);
  const [yaCalificado, setYaCalificado] = useState(false);

  const getUsuarioId = (): number | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  // Verificar si el usuario ya calificó este curso
  const verificarYaCalificado = async () => {
    try {
      const token = localStorage.getItem('token');
      const usuarioId = getUsuarioId();
      if (!usuarioId) return;

      const res = await fetch(`educacionenlinea-production.up.railway.app/calificaciones/curso/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const calificaciones = await res.json();
      
      if (Array.isArray(calificaciones)) {
        const existe = calificaciones.some((c: any) => c.usuario_id === usuarioId);
        setYaCalificado(existe);
      }
    } catch (error) {
      console.error('Error verificando calificación:', error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const usuario_id = getUsuarioId();

      // Obtener detalles del curso
      const resCurso = await fetch(`educacionenlinea-production.up.railway.app/cursos/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const cursoData = await resCurso.json();
      setCurso(cursoData);

      // Obtener progreso del usuario
      const resProgreso = await fetch(`educacionenlinea-production.up.railway.app/progreso/curso/${id}?usuario_id=${usuario_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const progresoData = await resProgreso.json();
      setProgreso(progresoData);

      // Seleccionar primer video no visto o el primero
      const primerNoVisto = progresoData.progreso?.find((v: Video) => !v.visto);
      if (primerNoVisto) {
        setVideoActual(primerNoVisto);
      } else if (progresoData.progreso?.length > 0) {
        setVideoActual(progresoData.progreso[0]);
      }

      // Verificar si ya calificó
      await verificarYaCalificado();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarVisto = async (videoId: number) => {
    try {
      const token = localStorage.getItem('token');
      const usuario_id = getUsuarioId();

      await fetch('educacionenlinea-production.up.railway.app/progreso/ver-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ usuario_id, video_id: videoId })
      });

      await fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para calificar el curso
  const calificarCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalificando(true);
    
    try {
      const token = localStorage.getItem('token');
      const usuario_id = getUsuarioId();

      const res = await fetch(`educacionenlinea-production.up.railway.app/calificaciones/${usuario_id}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ puntuacion, comentario })
      });

      const data = await res.json();

      if (res.ok) {
        setMostrarModalCalificacion(false);
        setYaCalificado(true);
        setPuntuacion(5);
        setComentario('');
        alert('¡Gracias por calificar el curso! 🎉');
        
        await generarCertificado();
      } else {
        alert(data.error || 'Error al calificar el curso');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al calificar');
    } finally {
      setCalificando(false);
    }
  };

  // Función para generar certificado automáticamente después de calificar
  const generarCertificado = async () => {
    try {
      const token = localStorage.getItem('token');
      const usuario_id = getUsuarioId();

      const res = await fetch('educacionenlinea-production.up.railway.app/certificados/generar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ usuario_id, curso_id: id })
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Certificado generado:', data.archivo_url);
      }
    } catch (error) {
      console.error('Error generando certificado:', error);
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

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando curso...</div>;
  if (!curso) return <div style={{ textAlign: 'center', padding: '2rem' }}>Curso no encontrado</div>;

  return (
    <div>
      {/* Botón volver */}
      <button
        onClick={() => router.push('/cliente/cursos')}
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

      {/* Información del curso */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{curso.nombre}</h1>
        <p style={{ color: '#64748b', marginBottom: '0.3rem' }}>Profesor: {curso.profesor || 'No asignado'}</p>
        <p style={{ color: '#64748b', marginBottom: '0.3rem' }}>Especialidad: {curso.especialidad || 'General'}</p>
      </div>

      {/* Barra de progreso */}
      {progreso && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Tu progreso</span>
            <span style={{ fontWeight: 'bold' }}>
              {progreso.videos_vistos} / {progreso.total_videos} videos
            </span>
          </div>
          <div
            style={{
              backgroundColor: '#e2e8f0',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progreso.porcentaje}%`,
                backgroundColor: progreso.completado ? '#10b981' : '#3b82f6',
                height: '100%',
                transition: 'width 0.3s'
              }}
            />
          </div>

          {progreso.completado && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                backgroundColor: '#d1fae5',
                color: '#065f46',
                borderRadius: '5px',
                textAlign: 'center'
              }}
            >
              🎉 ¡Felicidades! Has completado todos los videos de este curso
            </div>
          )}

          {/* Botón para calificar - Solo si el curso está completado y no ha calificado */}
          {progreso.completado && !yaCalificado && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                onClick={() => setMostrarModalCalificacion(true)}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ⭐ Calificar este curso
              </button>
            </div>
          )}

          {/* Mensaje si ya calificó */}
          {progreso.completado && yaCalificado && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                borderRadius: '5px',
                textAlign: 'center'
              }}
            >
              ⭐ ¡Gracias por calificar este curso! Ya puedes ver tu certificado.
              <br />
              <a
                href="/cliente/certificados"
                style={{ color: '#f59e0b', textDecoration: 'underline' }}
              >
                Ver mis certificados →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Lista de videos */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <h2 style={{ padding: '1rem', margin: 0, borderBottom: '1px solid #e2e8f0' }}>
          Videos del Curso
        </h2>
        <div>
          {progreso?.progreso.map((video, index) => (
            <div
              key={video.id}
              onClick={() => handleVerVideo(video)}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                backgroundColor: video.visto ? '#f0fdf4' : 'white',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: video.visto ? '#10b981' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: video.visto ? 'white' : '#64748b'
                  }}
                >
                  {video.visto ? '✓' : index + 1}
                </div>
                <div>
                  <div style={{ fontWeight: video.visto ? 'normal' : 'bold' }}>
                    {video.titulo}
                  </div>
                  {video.visto && (
                    <div style={{ fontSize: '0.8rem', color: '#10b981' }}>
                      ✔ Completado
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '1.5rem' }}>▶</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de video */}
      {mostrarModal && videoActual && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              backgroundColor: 'black',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '1000px',
              position: 'relative'
            }}
          >
            <button
              onClick={handleCerrarVideo}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                backgroundColor: 'white',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '32px',
                height: '32px'
              }}
            >
              ✕
            </button>
            <video
              src={videoActual.url_video}
              controls
              autoPlay
              style={{ width: '100%', borderRadius: '12px' }}
              onEnded={() => handleCerrarVideo()}
            />
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#1e293b',
                color: 'white',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px'
              }}
            >
              <h3>{videoActual.titulo}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Modal de calificación */}
      {mostrarModalCalificacion && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px'
            }}
          >
            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>⭐ Calificar Curso</h2>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              ¿Qué te pareció {curso.nombre}?
            </p>

            <form onSubmit={calificarCurso}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Puntuación (1-5 estrellas)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '2rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setPuntuacion(star)}
                      style={{
                        fontSize: '2.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: star <= puntuacion ? '#f59e0b' : '#cbd5e1',
                        padding: '0',
                        transition: 'transform 0.1s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Comentario
                </label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Comparte tu experiencia con este curso..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={calificando}
                  style={{
                    flex: 1,
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: calificando ? 'not-allowed' : 'pointer',
                    opacity: calificando ? 0.7 : 1
                  }}
                >
                  {calificando ? 'Enviando...' : 'Enviar Calificación'}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModalCalificacion(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#64748b',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}