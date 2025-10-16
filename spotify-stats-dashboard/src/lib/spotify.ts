import axios from 'axios';

export async function getAccessToken(code: string) {
  const redirectUri =
    process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
    process.env.SPOTIFY_REDIRECT_URI ||
    '';

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);

  const headers = {
    'Authorization':
      'Basic ' +
      Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const res = await axios.post('https://accounts.spotify.com/api/token', params, { headers });
  return res.data;
}

export async function getTopTracks(access_token: string) {
  const res = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data.items;
}
