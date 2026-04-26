'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';

export default function RegistroPage() {
  const router = useRouter();
  const [nombre_completo, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiPost('/auth/registro', { 
        nombre_completo, 
        correo, 
        password, 
        rol: 'USUARIO' 
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', 'USUARIO');
        router.push('/cliente/cursos');
      } else {
        setError(data.error || 'Error al registrarse');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Registro</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegistro}>
        <div>
          <label>Nombre Completo:</label>
          <input
            type="text"
            value={nombre_completo}
            onChange={(e) => setNombreCompleto(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
            required
          />
        </div>
        <div>
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
            required
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <a href="/auth/login">¿Ya tienes cuenta? Inicia Sesión</a>
    </div>
  );
}