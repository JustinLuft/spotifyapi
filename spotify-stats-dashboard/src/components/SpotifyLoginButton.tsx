'use client';

import React from 'react';

const scopes = [
  'user-top-read', // Needed to get top tracks
  'user-read-email', 
].join(' ');

export default function SpotifyLoginButton() {
  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri!)}`;

    window.location.href = url;
  };

  return (
    <button onClick={login} className="btn-login">
      Login with Spotify
    </button>
  );
}
