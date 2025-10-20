'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardPage() {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'tracks' | 'artists'>('tracks');
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
  const searchParams = useSearchParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      canvasWidth: number;
      canvasHeight: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > this.canvasWidth) this.x = 0;
        if (this.x < 0) this.x = this.canvasWidth;
        if (this.y > this.canvasHeight) this.y = 0;
        if (this.y < 0) this.y = this.canvasHeight;
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = `rgba(29, 185, 84, ${this.opacity})`;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    let animationFrameId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      setCanvasSize();
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

 useEffect(() => {
    if (!searchParams) return;

    const tokenFromQuery = searchParams.get('access_token');
    if (tokenFromQuery) {
      localStorage.setItem('spotify_access_token', tokenFromQuery);
      router.replace('/dashboard');
    }

    const token = localStorage.getItem('spotify_access_token');
    console.log('Access token from localStorage:', token);

    if (!token) {
      console.log('No access token found. Make sure you are logged in.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [tracksRes, artistsRes] = await Promise.all([
          axios.get(`/api/top-tracks?time_range=${timeRange}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/top-artists?time_range=${timeRange}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log('Top tracks response:', tracksRes.data);
        console.log('Top artists response:', artistsRes.data);
        
        setTopTracks(tracksRes.data);
        setTopArtists(artistsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, router, timeRange]);


  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'short_term': return 'Last 4 Weeks';
      case 'medium_term': return 'Last 6 Months';
      case 'long_term': return 'All Time';
      default: return '';
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalPlaytime = () => {
    if (topTracks.length === 0) return '0:00';
    const total = topTracks.reduce((acc, track) => acc + (track.duration_ms || 0), 0);
    const hours = Math.floor(total / 3600000);
    const minutes = Math.floor((total % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
        
        .grain-texture {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.06;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        
        .dashboard-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        
        .stat-card {
          font-family: 'Cormorant Garamond', serif;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(29, 185, 84, 0.3);
          padding: 25px;
          clip-path: polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%);
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          background: rgba(0, 0, 0, 0.7);
          border-color: rgba(29, 185, 84, 0.6);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(29, 185, 84, 0.2);
        }
        
        .item-card {
          font-family: 'Cormorant Garamond', serif;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(29, 185, 84, 0.2);
          padding: 20px 25px;
          margin-bottom: 15px;
          position: relative;
          clip-path: polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%);
          transition: all 0.3s ease;
        }
        
        .item-card:hover {
          background: rgba(0, 0, 0, 0.6);
          border-color: rgba(29, 185, 84, 0.5);
          transform: translateX(5px);
          box-shadow: -5px 0 20px rgba(29, 185, 84, 0.2);
        }
        
        .item-name {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1DB954;
          margin-bottom: 8px;
          text-shadow: 0 0 10px rgba(29, 185, 84, 0.3);
        }
        
        .item-subtitle {
          font-size: 1.1rem;
          color: #b8b8b8;
          font-weight: 300;
        }
        
        .item-number {
          position: absolute;
          left: -40px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: rgba(29, 185, 84, 0.3);
        }
        
        .custom-select {
          font-family: 'Cormorant Garamond', serif;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(29, 185, 84, 0.4);
          color: #1DB954;
          padding: 12px 20px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          clip-path: polygon(1% 0%, 99% 0%, 100% 1%, 100% 99%, 99% 100%, 1% 100%, 0% 99%, 0% 1%);
        }
        
        .custom-select:hover {
          background: rgba(0, 0, 0, 0.8);
          border-color: rgba(29, 185, 84, 0.7);
        }
        
        .custom-select option {
          background: #000;
          color: #1DB954;
        }
        
        .view-button {
          font-family: 'Cormorant Garamond', serif;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(29, 185, 84, 0.4);
          color: #b8b8b8;
          padding: 12px 30px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          clip-path: polygon(1% 0%, 99% 0%, 100% 1%, 100% 99%, 99% 100%, 1% 100%, 0% 99%, 0% 1%);
        }
        
        .view-button.active {
          background: rgba(29, 185, 84, 0.2);
          border-color: rgba(29, 185, 84, 0.8);
          color: #1DB954;
          box-shadow: 0 0 20px rgba(29, 185, 84, 0.3);
        }
        
        .view-button:hover {
          background: rgba(29, 185, 84, 0.15);
          border-color: rgba(29, 185, 84, 0.6);
          color: #1DB954;
        }
        
        .loading-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #1DB954;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      <canvas 
        ref={canvasRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <div className="grain-texture"></div>

      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
        color: '#fff',
        position: 'relative',
        padding: '80px 20px 60px'
      }}>
        <div style={{
          position: 'absolute',
          top: '100px',
          right: '50px',
          width: '300px',
          height: '300px',
          opacity: 0.02
        }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M50,10 L80,50 L50,90 L20,50 Z" fill="none" stroke="#1DB954" strokeWidth="0.5"/>
            <path d="M50,25 L65,50 L50,75 L35,50 Z" fill="none" stroke="#1DB954" strokeWidth="0.5"/>
          </svg>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
              <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to right, transparent, #1DB954)' }}></div>
              <svg width="25" height="25" viewBox="0 0 25 25">
                <path d="M12.5,0 L25,12.5 L12.5,25 L0,12.5 Z" fill="none" stroke="#1DB954" strokeWidth="2"/>
                <circle cx="12.5" cy="12.5" r="4" fill="#1DB954" opacity="0.5"/>
              </svg>
              <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to left, transparent, #1DB954)' }}></div>
            </div>

            <h1 className="dashboard-title" style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              marginBottom: '15px',
              background: 'linear-gradient(180deg, #1DB954 0%, #1ed760 50%, #1DB954 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(29, 185, 84, 0.4))'
            }}>
              Music Overview
            </h1>

            <div style={{
              height: '2px',
              width: '250px',
              maxWidth: '80%',
              margin: '0 auto',
              background: 'linear-gradient(to right, transparent, #1DB954 20%, #1DB954 80%, transparent)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '8px',
                height: '8px',
                background: '#1DB954',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
              }}></div>
            </div>
          </div>

          {/* Overview Stats */}
          {!loading && (topTracks.length > 0 || topArtists.length > 0) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '50px',
              padding: '0 10px'
            }}>
            
              
             
            </div>
          )}

          {/* Controls */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '40px',
            padding: '0 20px',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* View Toggle */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                className={`view-button ${activeView === 'tracks' ? 'active' : ''}`}
                onClick={() => setActiveView('tracks')}
              >
                Top Tracks
              </button>
              <button
                className={`view-button ${activeView === 'artists' ? 'active' : ''}`}
                onClick={() => setActiveView('artists')}
              >
                Top Artists
              </button>
            </div>

            {/* Time Range Selector */}
            <select
              className="custom-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
            >
              <option value="short_term">Last 4 Weeks</option>
              <option value="medium_term">Last 6 Months</option>
              <option value="long_term">All Time</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <svg width="50" height="50" viewBox="0 0 50 50" style={{ marginBottom: '20px' }}>
                <circle cx="25" cy="25" r="20" fill="none" stroke="#1DB954" strokeWidth="3" strokeDasharray="31.4 31.4" opacity="0.3">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
              <p className="loading-text">Loading your music data...</p>
            </div>
          )}

          {/* Tracks View */}
          {!loading && activeView === 'tracks' && topTracks.length > 0 && (
            <div style={{ padding: '0 20px' }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.8rem',
                color: '#1DB954',
                marginBottom: '25px',
                textAlign: 'center',
                letterSpacing: '0.05em'
              }}>
                {getTimeRangeLabel(timeRange)} - Top Tracks
              </h2>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                maxWidth: '900px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                {topTracks.map((track, index) => (
                  <li key={track.id} className="item-card" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span className="item-number">{String(index + 1).padStart(2, '0')}</span>

                    {track.album?.images?.[0] && (
                      <img
                        src={track.album.images[0].url}
                        alt={track.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                      />
                    )}

                    <div style={{ flex: 1 }}>
                      <div className="item-name">{track.name}</div>
                      <div className="item-subtitle">
                        {track.artists.map((a: any) => a.name).join(', ')}
                      </div>
                    </div>

                    <div style={{ 
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '1rem',
                      color: '#666',
                      flexShrink: 0
                    }}>
                      {formatDuration(track.duration_ms)}
                    </div>

                    <svg
                      style={{ position: 'absolute', top: '5px', right: '5px', width: '15px', height: '15px', opacity: 0.3 }}
                      viewBox="0 0 15 15"
                    >
                      <path d="M0,0 L15,0 L15,1 L1,1 L1,15 L0,15 Z" fill="#1DB954" />
                    </svg>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Artists View */}
          {!loading && activeView === 'artists' && topArtists.length > 0 && (
            <div style={{ padding: '0 20px' }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.8rem',
                color: '#1DB954',
                marginBottom: '25px',
                textAlign: 'center',
                letterSpacing: '0.05em'
              }}>
                {getTimeRangeLabel(timeRange)} - Top Artists
              </h2>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                maxWidth: '900px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                {topArtists.map((artist, index) => (
                  <li key={artist.id} className="item-card" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span className="item-number">{String(index + 1).padStart(2, '0')}</span>

                    {artist.images?.[0] && (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }}
                      />
                    )}

                    <div style={{ flex: 1 }}>
                      <div className="item-name">{artist.name}</div>
                      <div className="item-subtitle">
                        {artist.genres?.slice(0, 3).join(', ') || 'Artist'}
                      </div>
                    </div>

                    <div style={{ 
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '1rem',
                      color: '#666',
                      flexShrink: 0
                    }}>
                      {artist.followers?.total?.toLocaleString()} followers
                    </div>

                    <svg
                      style={{ position: 'absolute', top: '5px', right: '5px', width: '15px', height: '15px', opacity: 0.3 }}
                      viewBox="0 0 15 15"
                    >
                      <path d="M0,0 L15,0 L15,1 L1,1 L1,15 L0,15 Z" fill="#1DB954" />
                    </svg>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No Data State */}
          {!loading && topTracks.length === 0 && topArtists.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <svg width="60" height="60" viewBox="0 0 60 60" style={{ marginBottom: '20px', opacity: 0.3 }}>
                <path d="M30,5 L55,30 L30,55 L5,30 Z" fill="none" stroke="#1DB954" strokeWidth="2"/>
              </svg>
              <p style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.3rem',
                color: '#666'
              }}>
                No data found. Please log in to view your music statistics.
              </p>
            </div>
          )}
        </div>

        <div style={{
          position: 'fixed',
          bottom: '10%',
          left: '20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(29, 185, 84, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 1
        }}></div>
      </div>
    </>
  );}