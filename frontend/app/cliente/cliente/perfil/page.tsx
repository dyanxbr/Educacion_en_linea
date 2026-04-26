'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPut, apiPutFormData } from '@/lib/api';

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [mensaje, setMensaje] = useState('');

  const getUsuarioId = () => {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token!.split('.')[1]));
    return payload.id;
  };

  const cargarPerfil = async () => {
    const usuarioId = getUsuarioId();
    const data = await apiGet(`/usuarios/perfil/${usuarioId}`);
    setUsuario(data);
  };

  const cambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const usuarioId = getUsuarioId();
    const data = await apiPut(`/usuarios/cambiar-password/${usuarioId}`, { password_actual: passwordActual, password_nueva: passwordNueva });
    setMensaje(data.mensaje || data.error);
    if (data.mensaje) {
      setPasswordActual('');
      setPasswordNueva('');
    }
  };

  const cambiarTema = async (tema: string) => {
    const usuarioId = getUsuarioId();
    await apiPut(`/usuarios/tema/${usuarioId}`, { tema });
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

  if (!usuario) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Mi Perfil</h1>
      {mensaje && <p>{mensaje}</p>}
      <div>
        <img src={usuario.imagen_url || '/avatar.png'} alt="Perfil" width={100} />
        <input type="file" accept="image/*" onChange={cambiarImagen} />
      </div>
      <p><strong>Nombre:</strong> {usuario.nombre_completo}</p>
      <p><strong>Correo:</strong> {usuario.correo}</p>
      <p><strong>Tema actual:</strong> {usuario.tema || 'CLARO'}</p>
      <div>
        <button onClick={() => cambiarTema('CLARO')}>🌞 Claro</button>
        <button onClick={() => cambiarTema('OSCURO')}>🌙 Oscuro</button>
      </div>
      <form onSubmit={cambiarPassword}>
        <h3>Cambiar Contraseña</h3>
        <input type="password" placeholder="Contraseña actual" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} required />
        <input type="password" placeholder="Nueva contraseña" value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} required />
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
}