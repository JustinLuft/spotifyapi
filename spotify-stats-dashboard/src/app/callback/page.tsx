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
    axios
      .get(`/api/spotify/callback?code=${code}`)
      .then((res) => {
        const { access_token } = res.data;
        console.log('Spotify token data:', res.data);

        // Store in localStorage
        localStorage.setItem('spotify_access_token', access_token);

        // Debug: confirm token is stored
        const tokenCheck = localStorage.getItem('spotify_access_token');
        console.log('Token stored in localStorage?', tokenCheck ? 'YES' : 'NO', tokenCheck);

        router.push('/top-tracks'); // redirect to dashboard
      })
      .catch((err) => {
        console.error('Failed to get access token', err);
      });
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0e1a12] text-[#1DB954] font-mono">
      <div className="relative text-center">
        {/* Glowing Deco Frame */}
        <div className="absolute inset-0 border-2 border-[#1DB954]/30 rounded-2xl blur-sm"></div>

        <div className="relative z-10 p-10 bg-[#0e1a12]/80 rounded-2xl shadow-[0_0_20px_#1DB95455]">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 tracking-widest">
            CONNECTING TO SPOTIFY
          </h1>
          <p className="text-[#a7ffcb] text-sm md:text-base animate-pulse">
            Logging you in securely...
          </p>

          {/* Loading animation */}
          <div className="mt-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin"></div>
          </div>

          {/* Deco corner */}
          <svg
            className="absolute top-2 right-2 w-5 h-5 opacity-30"
            viewBox="0 0 15 15"
          >
            <path d="M0,0 L15,0 L15,1 L1,1 L1,15 L0,15 Z" fill="#1DB954" />
          </svg>
        </div>
      </div>
    </div>
  );
}
