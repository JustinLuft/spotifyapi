'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardPage() {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams) return; // <-- safeguard for TypeScript

    // Check if access_token is in URL
    const tokenFromQuery = searchParams.get('access_token');
    if (tokenFromQuery) {
      localStorage.setItem('spotify_access_token', tokenFromQuery);
      router.replace('/dashboard'); // remove token from URL
    }

    const token = localStorage.getItem('spotify_access_token');
    console.log('Access token from localStorage:', token);

    if (!token) return console.log('No access token found. Make sure you are logged in.');

    axios.get('/api/top-tracks', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      console.log('Top tracks response:', res.data);
      setTopTracks(res.data);
    })
    .catch(console.error);
  }, [searchParams, router]);

  return (
    <div>
      <h1>Your Top Tracks</h1>
      {topTracks.length === 0 && <p>Loading tracks...</p>}
      <ul>
        {topTracks.map(track => (
          <li key={track.id}>
            {track.name} by {track.artists.map(a => a.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
