'use client';

import React from 'react';

const scopes = [
  'user-top-read', 
  'user-read-email', 
].join(' ');

type Props = {
  style?: React.CSSProperties;
};

export default function SpotifyLoginButton({ style }: Props) {
  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
      scopes
    )}&redirect_uri=${encodeURIComponent(redirectUri!)}`;

    window.location.href = url;
  };

  return (
    <button onClick={login} style={style} className="btn-login">
      Login with Spotify
    </button>
  );
}
