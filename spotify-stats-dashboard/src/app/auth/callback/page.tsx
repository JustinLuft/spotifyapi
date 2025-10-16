'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (!code) return;

    (async () => {
      try {
        const res = await fetch(`/api/spotify/callback?code=${code}`);
        if (!res.ok) throw new Error('Failed to get access token');
        const data = await res.json();
        console.log('Spotify token data:', data);

        // After login, redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error(err);
      }
    })();
  }, [router]);

  return <p>Logging you in...</p>;
}
