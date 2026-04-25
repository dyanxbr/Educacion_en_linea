'use client';

import { useEffect, useState } from 'react';

interface Usuario {
  id: number;
  nombre_completo: string;
  correo: string;
  imagen_url: string;
  tema: string;
  rol: string;
  fecha_registro: string;
}

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

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

  const cargarPerfil = async () => {
    try {
      const token = localStorage.getItem('token');
      const usuarioId = getUsuarioId();
      if (!usuarioId) return;

      const res = await fetch(`educacionenlinea-production.up.railway.app/usuarios/perfil/${usuarioId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuario(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const usuarioId = getUsuarioId();

      const res = await fetch(`educacionenlinea-production.up.railway.app/usuarios/cambiar-password/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password_actual: passwordActual,
          password_nueva: passwordNueva
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje('Contraseña actualizada correctamente');
        setPasswordActual('');
        setPasswordNueva('');
      } else {
        setError(data.error || 'Error al cambiar contraseña');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const cambiarTema = async (tema: string) => {
    try {
      const token = localStorage.getItem('token');
      const usuarioId = getUsuarioId();

      const res = await fetch(`educacionenlinea-production.up.railway.app/usuarios/tema/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tema })
      });

      if (res.ok) {
        cargarPerfil();
        setMensaje(`Tema cambiado a ${tema}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cambiarImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imagen', file);

    try {
      const token = localStorage.getItem('token');
      const usuarioId = getUsuarioId();

      const res = await fetch(`educacionenlinea-production.up.railway.app/usuarios/imagen/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        cargarPerfil();
        setMensaje('Imagen actualizada correctamente');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando perfil...</div>;
  if (!usuario) return <div style={{ textAlign: 'center', padding: '2rem' }}>Error al cargar perfil</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>Mi Perfil</h1>

      {mensaje && (
        <div style={{
          backgroundColor: '#d1fae5',
          color: '#065f46',
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {mensaje}
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Columna izquierda - Información */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Información Personal</h2>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            {usuario.imagen_url ? (
              <img src={usuario.imagen_url} alt="Perfil" style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '0.5rem'
              }} />
            ) : (
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                margin: '0 auto 0.5rem',
                color: 'white'
              }}>
                👤
              </div>
            )}
            <div>
              <label htmlFor="imagen" style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.4rem 1rem',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'inline-block',
                fontSize: '0.9rem'
              }}>
                Cambiar Foto
              </label>
              <input
                id="imagen"
                type="file"
                accept="image/*"
                onChange={cambiarImagen}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <p><strong>Nombre:</strong> {usuario.nombre_completo}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
          <p><strong>Miembro desde:</strong> {new Date(usuario.fecha_registro).toLocaleDateString()}</p>
        </div>

        {/* Columna derecha - Configuración */}
        <div>
          {/* Tema */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Apariencia</h2>
            <p style={{ marginBottom: '0.5rem' }}>Tema actual: <strong>{usuario.tema || 'CLARO'}</strong></p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => cambiarTema('CLARO')}
                style={{
                  padding: '0.4rem 1rem',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: usuario.tema === 'CLARO' ? '#3b82f6' : 'white',
                  color: usuario.tema === 'CLARO' ? 'white' : '#333',
                  cursor: 'pointer'
                }}
              >
                ☀️ Claro
              </button>
              <button
                onClick={() => cambiarTema('OSCURO')}
                style={{
                  padding: '0.4rem 1rem',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: usuario.tema === 'OSCURO' ? '#3b82f6' : 'white',
                  color: usuario.tema === 'OSCURO' ? 'white' : '#333',
                  cursor: 'pointer'
                }}
              >
                🌙 Oscuro
              </button>
            </div>
          </div>

          {/* Cambiar contraseña */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Seguridad</h2>
            <form onSubmit={cambiarPassword}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem' }}>Contraseña actual</label>
                <input
                  type="password"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem' }}>Nueva contraseña</label>
                <input
                  type="password"
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                  }}
                  required
                />
              </div>
              <button type="submit" style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Actualizar Contraseña
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}