'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPut, apiPutFormData } from '@/lib/api';

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [temaActual, setTemaActual] = useState('CLARO');

  const getUsuarioId = () => {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token!.split('.')[1]));
    return payload.id;
  };

  const cargarPerfil = async () => {
    const usuarioId = getUsuarioId();
    const data = await apiGet(`/usuarios/perfil/${usuarioId}`);
    setUsuario(data);
    setTemaActual(data.tema || 'CLARO');
    document.body.style.backgroundColor = data.tema === 'OSCURO' ? '#121212' : '#f5f5f5';
  };

  const cambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const usuarioId = getUsuarioId();
    const data = await apiPut(`/usuarios/cambiar-password/${usuarioId}`, { 
      password_actual: passwordActual, 
      password_nueva: passwordNueva 
    });
    setMensaje(data.mensaje || data.error);
    if (data.mensaje) {
      setPasswordActual('');
      setPasswordNueva('');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const cambiarTema = async (tema: string) => {
    const usuarioId = getUsuarioId();
    await apiPut(`/usuarios/tema/${usuarioId}`, { tema });
    setTemaActual(tema);
    document.body.style.backgroundColor = tema === 'OSCURO' ? '#121212' : '#f5f5f5';
    cargarPerfil();
  };

  const cambiarImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('imagen', file);
    const usuarioId = getUsuarioId();
    await apiPutFormData(`/usuarios/imagen/${usuarioId}`, formData);
    cargarPerfil();
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  if (!usuario) {
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

  const isDark = temaActual === 'OSCURO';

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          color: isDark ? '#fff' : '#1a1a1a',
          marginBottom: '0.5rem'
        }}>
          Mi Perfil
        </h1>
        <p style={{
          color: isDark ? '#888' : '#666',
          fontSize: '0.9rem'
        }}>
          Gestiona tu información personal
        </p>
      </div>

      {mensaje && (
        <div style={{
          backgroundColor: isDark ? '#0a3b2a' : '#d1fae5',
          color: isDark ? '#10b981' : '#065f46',
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          {mensaje}
        </div>
      )}

      <div style={{
        backgroundColor: isDark ? '#1e1e1e' : 'white',
        borderRadius: '16px',
        padding: '2rem',
        border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={usuario.imagen_url || `https://ui-avatars.com/api/?background=2563eb&color=fff&size=120&name=${encodeURIComponent(usuario.nombre_completo)}`}
              alt="Perfil"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${isDark ? '#2563eb' : '#e0e0e0'}`
              }}
            />
            <label htmlFor="imagen" style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              backgroundColor: '#2563eb',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              border: `2px solid ${isDark ? '#1e1e1e' : 'white'}`
            }}>
              ✏️
            </label>
            <input
              id="imagen"
              type="file"
              accept="image/*"
              onChange={cambiarImagen}
              style={{ display: 'none' }}
            />
          </div>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: isDark ? '#fff' : '#333',
            marginTop: '1rem',
            marginBottom: '0.25rem'
          }}>
            {usuario.nombre_completo}
          </h2>
          <p style={{ color: isDark ? '#aaa' : '#666', fontSize: '0.85rem' }}>
            {usuario.correo}
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '2rem',
          paddingBottom: '2rem',
          borderBottom: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: isDark ? '#aaa' : '#666', fontSize: '0.85rem' }}>Tema</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => cambiarTema('CLARO')}
                style={{
                  backgroundColor: temaActual === 'CLARO' ? '#2563eb' : 'transparent',
                  color: temaActual === 'CLARO' ? 'white' : isDark ? '#fff' : '#333',
                  border: `1px solid ${temaActual === 'CLARO' ? '#2563eb' : isDark ? '#444' : '#e0e0e0'}`,
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Claro
              </button>
              <button
                onClick={() => cambiarTema('OSCURO')}
                style={{
                  backgroundColor: temaActual === 'OSCURO' ? '#2563eb' : 'transparent',
                  color: temaActual === 'OSCURO' ? 'white' : isDark ? '#fff' : '#333',
                  border: `1px solid ${temaActual === 'OSCURO' ? '#2563eb' : isDark ? '#444' : '#e0e0e0'}`,
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Oscuro
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: isDark ? '#aaa' : '#666', fontSize: '0.85rem' }}>Miembro desde</span>
            <span style={{ color: isDark ? '#fff' : '#333', fontSize: '0.85rem' }}>
              {new Date(usuario.fecha_registro).toLocaleDateString()}
            </span>
          </div>
        </div>

        <form onSubmit={cambiarPassword}>
          <h3 style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: isDark ? '#fff' : '#333',
            marginBottom: '1rem'
          }}>
            Cambiar contraseña
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="Contraseña actual"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: isDark ? '#2a2a2a' : 'white',
                color: isDark ? '#fff' : '#333'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = isDark ? '#444' : '#e0e0e0'}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: isDark ? '#2a2a2a' : 'white',
                color: isDark ? '#fff' : '#333'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={(e) => e.currentTarget.style.borderColor = isDark ? '#444' : '#e0e0e0'}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: '#2563eb',
              border: '1px solid #2563eb',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#2563eb';
            }}
          >
            Actualizar contraseña
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}