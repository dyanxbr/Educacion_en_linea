'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<any[]>([]);

  const getUsuarioId = () => {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token!.split('.')[1]));
    return payload.id;
  };

  useEffect(() => {
    const fetchCertificados = async () => {
      const usuarioId = getUsuarioId();
      const data = await apiGet(`/certificados/mis-certificados?usuario_id=${usuarioId}`);
      setCertificados(data);
    };
    fetchCertificados();
  }, []);

  return (
    <div>
      <h1>Mis Certificados</h1>
      {certificados.length === 0 ? (
        <p>No tienes certificados aún. Completa y califica un curso.</p>
      ) : (
        <ul>
          {certificados.map(cert => (
            <li key={cert.id}>
              <strong>{cert.curso}</strong> - {cert.profesor} - 
              <a href={cert.archivo_url} target="_blank"> Ver Certificado PDF</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}