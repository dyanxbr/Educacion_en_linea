'use client';

import { useEffect, useState } from 'react';

interface Certificado {
  id: number;
  archivo_url: string;
  tipo: string;
  fecha: string;
  curso: string;
  profesor: string;
}

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchCertificados = async () => {
    try {
      const token = localStorage.getItem('token');
      const usuarioId = getUsuarioId();
      
      if (!usuarioId) {
        setError('Usuario no identificado');
        return;
      }

      const res = await fetch(`educacionenlinea-production.up.railway.app/certificados/mis-certificados?usuario_id=${usuarioId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      // 🔧 IMPORTANTE: Asegurar que data sea un array
      if (Array.isArray(data)) {
        setCertificados(data);
      } else {
        console.error('La API no devolvió un array:', data);
        setCertificados([]);
        setError('No se pudieron cargar los certificados');
      }
    } catch (error) {
      console.error('Error:', error);
      setCertificados([]);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificados();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando certificados...</div>;

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchCertificados} style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Mis Certificados</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Certificados obtenidos al completar y calificar cursos
      </p>

      {!certificados || certificados.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h2>Aún no tienes certificados</h2>
          <p>Completa todos los videos de un curso y califícalo para obtener tu certificado.</p>
          <a href="/cliente/cursos" style={{
            display: 'inline-block',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            textDecoration: 'none',
            marginTop: '1rem'
          }}>
            Ver mis cursos
          </a>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {certificados.map((cert) => (
            <div key={cert.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderTop: '4px solid #f59e0b'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{cert.curso}</h2>
              <p style={{ color: '#64748b', marginBottom: '0.3rem' }}>Profesor: {cert.profesor || 'No especificado'}</p>
              <p style={{ color: '#64748b', marginBottom: '0.3rem' }}>Tipo: {cert.tipo}</p>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>Fecha: {new Date(cert.fecha).toLocaleDateString()}</p>
              <a
                href={cert.archivo_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.4rem 1rem',
                  borderRadius: '5px',
                  textDecoration: 'none'
                }}
              >
                📄 Ver Certificado
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}