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
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  const fetchCurso = async () => {
    const data = await apiGet(`/cursos/${id}`);
    setCurso(data);
    setVideos(data.videos || []);
    setLoading(false);
  };

  const agregarVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return;

    setSubiendo(true);
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
    setSubiendo(false);
  };

  const eliminarVideo = async (videoId: number) => {
    if (confirm('¿Eliminar este video?')) {
      await apiDelete(`/videos/${videoId}`);
      fetchCurso();
    }
  };

  useEffect(() => {
    fetchCurso();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e0e0e0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (!curso) return <div>Cargando...</div>;

  return (
    <div>
      <button
        onClick={() => router.push('/admin/cursos')}
        style={{
          backgroundColor: 'transparent',
          color: '#2563eb',
          border: 'none',
          padding: '0.5rem 0',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        ← Volver a cursos
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '0.5rem'
        }}>
          {curso.nombre}
        </h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Gestiona los videos de este curso
        </p>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '1.25rem'
        }}>
          Agregar video
        </h2>
        <form onSubmit={agregarVideo}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 0.5fr auto',
            gap: '1rem',
            alignItems: 'flex-end'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#333'
              }}>
                Título del video
              </label>
              <input
                type="text"
                placeholder="Ej: Introducción al curso"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#333'
              }}>
                Orden
              </label>
              <input
                type="number"
                placeholder="1, 2, 3..."
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#333'
              }}>
                Archivo
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={subiendo}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: subiendo ? 'not-allowed' : 'pointer',
              opacity: subiendo ? 0.7 : 1,
              transition: 'background-color 0.2s',
              marginTop: '1rem'
            }}
            onMouseEnter={(e) => !subiendo && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => !subiendo && (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            {subiendo ? 'Subiendo...' : 'Subir video'}
          </button>
        </form>
      </div>

      <div>
        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '1rem'
        }}>
          Videos del curso
        </h2>

        {videos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            color: '#666'
          }}>
            No hay videos en este curso
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            {videos.map((video, index) => (
              <div
                key={video.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: index === videos.length - 1 ? 'none' : '1px solid #e0e0e0',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#2563eb10',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {video.orden}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#333', marginBottom: '0.2rem' }}>
                      {video.titulo}
                    </div>
                    <a
                      href={video.url_video}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#2563eb',
                        fontSize: '0.8rem',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      Ver video
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => eliminarVideo(video.id)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    border: 'none',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc262610'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}