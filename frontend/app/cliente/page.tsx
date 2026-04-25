'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/cliente/cursos');
  }, [router]);

  return <div style={{ textAlign: 'center', padding: '2rem' }}>Redirigiendo a mis cursos...</div>;
}