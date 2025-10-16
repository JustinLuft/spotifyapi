'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('CallbackPage mounted');

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) {
      console.warn('No code in URL');
      return;
    }

    console.log('Spotify auth code:', code);

    // Exchange code for token via backend
    axios.get(`/api/spotify/callback?code=${code}`)
      .then(res => {
        const { access_token } = res.data;
        console.log('Spotify token data:', res.data);

        // Store in localStorage
        localStorage.setItem('spotify_access_token', access_token);

        // Debug: confirm token is stored
        const tokenCheck = localStorage.getItem('spotify_access_token');
        console.log('Token stored in localStorage?', tokenCheck ? 'YES' : 'NO', tokenCheck);

        router.push('/top-tracks'); // redirect to dashboard
      })
      .catch(err => {
        console.error('Failed to get access token', err);
      });
  }, [router]);

  return <p>Logging you in...</p>;
}
