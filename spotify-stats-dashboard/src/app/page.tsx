import SpotifyLoginButton from '../components/SpotifyLoginButton';

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to DataGrabber</h1>
      <p>See your top Spotify artists and tracks!</p>
      <SpotifyLoginButton />
    </div>
  );
}
