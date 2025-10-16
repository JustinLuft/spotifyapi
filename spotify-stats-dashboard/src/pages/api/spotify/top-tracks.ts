import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // For testing, read token from query or headers (for now)
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No access token provided' });

    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.status(200).json(response.data.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
}
