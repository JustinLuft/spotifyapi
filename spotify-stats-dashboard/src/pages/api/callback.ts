import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code as string);
    params.append('redirect_uri', process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!);

    const headers = {
      'Authorization': 'Basic ' + Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const tokenRes = await axios.post('https://accounts.spotify.com/api/token', params, { headers });
    const data = tokenRes.data;

    // Redirect to dashboard and include token in query string (so client can store it)
    const redirectUrl = `/dashboard?access_token=${data.access_token}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get access token' });
  }
}
