'use client';

import { useEffect, useRef } from 'react';
import SpotifyLoginButton from '../components/SpotifyLoginButton';
import '../styles/globals.css';

export default function HomePage() {
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

    // Particle class definition
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
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
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

    // Particle system
    const particles: Particle[] = [];
    const particleCount = 80;

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

      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = `rgba(29, 185, 84, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
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

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:wght@300;400;500&display=swap');
        
        body {
          margin: 0;
          overflow-x: hidden;
        }
        
        .grain-texture {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.08;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        
        .art-deco-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          position: relative;
        }
        
        .art-deco-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }
        
        .art-deco-body {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
        }
        
        .spotify-button-wrapper {
          display: inline-block;
          position: relative;
        }
        
        .spotify-button-wrapper::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
          z-index: -1;
          filter: blur(15px);
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }
        
        .spotify-button-wrapper:hover::before {
          opacity: 0.9;
        }
      `}</style>

      {/* Particle Canvas */}
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

      {/* Grain Texture Overlay */}
      <div className="grain-texture"></div>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        padding: '60px 20px'
      }}>

        {/* Geometric Background Elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden'
        }}>
          {/* Large central diamond */}
          <svg style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            opacity: 0.03
          }} viewBox="0 0 100 100">
            <path d="M50,10 L80,50 L50,90 L20,50 Z" fill="none" stroke="#1DB954" strokeWidth="0.5"/>
            <path d="M50,20 L70,50 L50,80 L30,50 Z" fill="none" stroke="#1DB954" strokeWidth="0.5"/>
          </svg>

          {/* Corner ornaments */}
          <svg style={{ position: 'absolute', top: '30px', left: '30px', width: '100px', height: '100px', opacity: 0.4 }} viewBox="0 0 100 100">
            <path d="M0,0 L100,0 L100,2 L2,2 L2,100 L0,100 Z" fill="#1DB954"/>
            <circle cx="15" cy="15" r="3" fill="#1DB954"/>
          </svg>
          <svg style={{ position: 'absolute', top: '30px', right: '30px', width: '100px', height: '100px', opacity: 0.4, transform: 'scaleX(-1)' }} viewBox="0 0 100 100">
            <path d="M0,0 L100,0 L100,2 L2,2 L2,100 L0,100 Z" fill="#1DB954"/>
            <circle cx="15" cy="15" r="3" fill="#1DB954"/>
          </svg>
          <svg style={{ position: 'absolute', bottom: '30px', left: '30px', width: '100px', height: '100px', opacity: 0.4, transform: 'scaleY(-1)' }} viewBox="0 0 100 100">
            <path d="M0,0 L100,0 L100,2 L2,2 L2,100 L0,100 Z" fill="#1DB954"/>
            <circle cx="15" cy="15" r="3" fill="#1DB954"/>
          </svg>
          <svg style={{ position: 'absolute', bottom: '30px', right: '30px', width: '100px', height: '100px', opacity: 0.4, transform: 'scale(-1)' }} viewBox="0 0 100 100">
            <path d="M0,0 L100,0 L100,2 L2,2 L2,100 L0,100 Z" fill="#1DB954"/>
            <circle cx="15" cy="15" r="3" fill="#1DB954"/>
          </svg>
        </div>

        {/* Main Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1000px',
          width: '100%',
          textAlign: 'center',
          padding: '0 20px'
        }}>
          
          {/* Top Decorative Line */}
          <div style={{ marginBottom: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to right, transparent, #1DB954)' }}></div>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <path d="M15,0 L30,15 L15,30 L0,15 Z" fill="none" stroke="#1DB954" strokeWidth="1.5"/>
              <path d="M15,7 L23,15 L15,23 L7,15 Z" fill="#1DB954" opacity="0.3"/>
            </svg>
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to left, transparent, #1DB954)' }}></div>
          </div>

          {/* Title */}
          <h1 className="art-deco-title" style={{
            fontSize: 'clamp(3rem, 12vw, 7rem)',
            marginBottom: '15px',
            lineHeight: 1,
            background: 'linear-gradient(180deg, #1DB954 0%, #1ed760 50%, #1DB954 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(29, 185, 84, 0.5))'
          }}>
            SpotLight
          </h1>

          {/* Decorative Underline */}
          <div style={{
            height: '3px',
            width: '300px',
            maxWidth: '80%',
            margin: '0 auto 40px',
            background: 'linear-gradient(to right, transparent, #1DB954 20%, #1DB954 80%, transparent)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '10px',
              height: '10px',
              background: '#1DB954',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }}></div>
          </div>

          {/* Subtitle */}
          <p className="art-deco-subtitle" style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)',
            marginBottom: '60px',
            color: '#1DB954',
            textShadow: '0 0 20px rgba(29, 185, 84, 0.4)'
          }}>
            Spotify Datafinder
          </p>

          {/* Central Diamond Ornament */}
          <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, #1DB954)' }}></div>
            <svg width="25" height="25" viewBox="0 0 25 25">
              <path d="M12.5,0 L25,12.5 L12.5,25 L0,12.5 Z" fill="none" stroke="#1DB954" strokeWidth="2"/>
              <circle cx="12.5" cy="12.5" r="4" fill="#1DB954" opacity="0.5"/>
            </svg>
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to left, transparent, #1DB954)' }}></div>
          </div>

          {/* Description */}
          <p className="art-deco-body" style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            marginBottom: '70px',
            maxWidth: '650px',
            margin: '0 auto 70px',
            color: '#b8b8b8',
            lineHeight: 1.8,
            fontWeight: 300
          }}>
            Find your spofiy account information at the click of a button.
          </p>

          {/* Button with Art Deco Frame */}
          <div style={{
            position: 'relative',
            display: 'inline-block'
          }}>
            {/* Outer decorative frame */}
            <div style={{
              position: 'absolute',
              inset: '-25px',
              border: '2px solid rgba(29, 185, 84, 0.2)',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)',
              pointerEvents: 'none'
            }}></div>

            {/* Inner frame accents */}
            <div style={{
              position: 'absolute',
              inset: '-15px',
              pointerEvents: 'none'
            }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: '10px', background: '#1DB954' }}></div>
              <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: '10px', background: '#1DB954' }}></div>
              <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '10px', height: '2px', background: '#1DB954' }}></div>
              <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '10px', height: '2px', background: '#1DB954' }}></div>
            </div>
            
            <div className="spotify-button-wrapper" style={{
              background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
              padding: '18px 70px',
              fontSize: '1.1rem',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 40px rgba(29, 185, 84, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}>
              <SpotifyLoginButton />
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div style={{ marginTop: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to right, transparent, #1DB954)' }}></div>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <path d="M15,0 L30,15 L15,30 L0,15 Z" fill="none" stroke="#1DB954" strokeWidth="1.5"/>
              <path d="M15,7 L23,15 L15,23 L7,15 Z" fill="#1DB954" opacity="0.3"/>
            </svg>
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to left, transparent, #1DB954)' }}></div>
          </div>
        </div>

        {/* Radial glow effects */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(29, 185, 84, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(29, 185, 84, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 2
        }}></div>
      </div>
    </>
  );
}