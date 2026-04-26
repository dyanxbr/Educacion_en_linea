'use client';

import { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CertificatePDF } from '@/app/components/CertificatePDF';
import { apiGet } from '@/lib/api';

interface CursoCompletado {
    id: number;
    nombre: string;
    profesor: string | null;
    completado: boolean;
    certificadoGenerado?: boolean;
}

export default function CertificadosPage() {
    const [cursosCompletados, setCursosCompletados] = useState<CursoCompletado[]>([]);
    const [loading, setLoading] = useState(true);
    const [usuarioNombre, setUsuarioNombre] = useState('');
    const [temaActual, setTemaActual] = useState('CLARO');

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

    const cargarTema = async () => {
        const usuarioId = getUsuarioId();
        if (!usuarioId) return;
        const data = await apiGet(`/usuarios/perfil/${usuarioId}`);
        setTemaActual(data.tema || 'CLARO');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usuarioId = getUsuarioId();
                if (!usuarioId) return;

                await cargarTema();

                const usuarioData = await apiGet(`/usuarios/perfil/${usuarioId}`);
                setUsuarioNombre(usuarioData.nombre_completo);

                const todosCursos = await apiGet('/cursos');
                
                const cursosConEstado = await Promise.all(
                    todosCursos.map(async (curso: any) => {
                        const progreso = await apiGet(`/progreso/curso/${curso.id}?usuario_id=${usuarioId}`);
                        return {
                            ...curso,
                            completado: progreso.completado || false,
                        };
                    })
                );

                const completados = cursosConEstado.filter(c => c.completado === true);
                setCursosCompletados(completados);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        document.body.style.backgroundColor = temaActual === 'OSCURO' ? '#121212' : '#f5f5f5';
    }, [temaActual]);

    const obtenerFechaActual = () => {
        return new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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

    const isDark = temaActual === 'OSCURO';

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '1.8rem',
                    fontWeight: '600',
                    color: isDark ? '#fff' : '#1a1a1a',
                    marginBottom: '0.5rem'
                }}>
                    Mis Certificados
                </h1>
                <p style={{
                    color: isDark ? '#888' : '#666',
                    fontSize: '0.9rem'
                }}>
                    Certificados obtenidos al completar cursos
                </p>
            </div>
            
            {cursosCompletados.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    backgroundColor: isDark ? '#1e1e1e' : 'white',
                    borderRadius: '16px',
                    color: isDark ? '#aaa' : '#666',
                    border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
                }}>
                    <p>No tienes certificados aún.</p>
                    <p style={{ fontSize: '0.9rem' }}>Completa todos los videos de un curso para obtener tu certificado</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {cursosCompletados.map((curso) => (
                        <div
                            key={curso.id}
                            style={{
                                backgroundColor: isDark ? '#1e1e1e' : 'white',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#2563eb';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = isDark ? '0 8px 20px rgba(0,0,0,0.3)' : '0 8px 20px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = isDark ? '#333' : '#e0e0e0';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div>
                                <h3 style={{
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    color: isDark ? '#fff' : '#1a1a1a',
                                    marginBottom: '0.3rem'
                                }}>
                                    {curso.nombre}
                                </h3>
                                <p style={{
                                    color: isDark ? '#aaa' : '#666',
                                    fontSize: '0.8rem'
                                }}>
                                    Profesor: {curso.profesor || 'No especificado'}
                                </p>
                            </div>
                            <div>
                                <PDFDownloadLink
                                    document={
                                        <CertificatePDF
                                            nombre={usuarioNombre}
                                            curso={curso.nombre}
                                            profesor={curso.profesor || ''}
                                            fecha={obtenerFechaActual()}
                                        />
                                    }
                                    fileName={`certificado_${curso.nombre.replace(/\s/g, '_')}.pdf`}
                                >
                                    {({ loading, error }) => {
                                        if (loading) return 'Generando PDF...';
                                        if (error) return 'Error al generar';
                                        return (
                                            <span style={{
                                                display: 'inline-block',
                                                backgroundColor: '#2563eb',
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '8px',
                                                fontSize: '0.8rem',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                textAlign: 'center'
                                            }}>
                                                Descargar Certificado
                                            </span>
                                        );
                                    }}
                                </PDFDownloadLink>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}