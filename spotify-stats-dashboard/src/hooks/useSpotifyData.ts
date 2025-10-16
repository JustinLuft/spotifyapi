'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useSpotifyData(endpoint: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(endpoint)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading };
}
