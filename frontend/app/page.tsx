'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al login
    router.push('/auth/login');
  }, [router]);

  return (
    <div>
      <p>Cargando...</p>
    </div>
  );
}