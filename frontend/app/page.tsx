'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    
    if (token && rol === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (token && rol === 'USUARIO') {
      router.push('/cliente/cursos');
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  return <div>Redirigiendo...</div>;
}