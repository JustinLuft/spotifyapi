'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardPage() {
  const [topTracks, setTopTracks] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) return;

    axios.get('/api/spotify/top-tracks', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setTopTracks(res.data))
    .catch(console.error);
  }, []);

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
