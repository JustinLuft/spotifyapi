'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
        
        .nav-link {
          position: relative;
          color: #1DB954;
          text-decoration: none;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          padding: 8px 16px;
          display: inline-block;
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, #1DB954, transparent);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover {
          color: #1ed760;
          text-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
        }
        
        .nav-link:hover::before {
          width: 80%;
        }
        
        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 1.4rem;
          text-decoration: none;
          transition: all 0.3s ease;
          filter: drop-shadow(0 0 15px rgba(29, 185, 84, 0.3));
        }
        
        .nav-logo:hover {
          filter: drop-shadow(0 0 20px rgba(29, 185, 84, 0.6));
        }
      `}</style>

      <nav style={{
        padding: '20px 40px',
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        borderBottom: '1px solid rgba(29, 185, 84, 0.2)',
        position: 'relative',
        zIndex: 1000
      }}>
        {/* Decorative top border */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(to right, transparent, #1DB954 20%, #1DB954 80%, transparent)'
        }}></div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Decorative diamond */}
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M10,0 L20,10 L10,20 L0,10 Z" fill="none" stroke="#1DB954" strokeWidth="1.5"/>
              <path d="M10,5 L15,10 L10,15 L5,10 Z" fill="#1DB954" opacity="0.3"/>
            </svg>
            
            <Link href="/" className="nav-logo">
              DataGrabber
            </Link>

            {/* Decorative diamond */}
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M10,0 L20,10 L10,20 L0,10 Z" fill="none" stroke="#1DB954" strokeWidth="1.5"/>
              <path d="M10,5 L15,10 L10,15 L5,10 Z" fill="#1DB954" opacity="0.3"/>
            </svg>
          </div>

          {/* Navigation Links */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px'
          }}>
            {/* Decorative separator */}
            <div style={{
              width: '1px',
              height: '30px',
              background: 'linear-gradient(to bottom, transparent, #1DB954, transparent)',
              marginRight: '10px'
            }}></div>

            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>

            {/* Small ornament */}
            <svg width="15" height="15" viewBox="0 0 15 15" style={{ margin: '0 5px' }}>
              <circle cx="7.5" cy="7.5" r="2" fill="#1DB954" opacity="0.5"/>
              <circle cx="7.5" cy="7.5" r="5" fill="none" stroke="#1DB954" strokeWidth="1"/>
            </svg>
          </div>
        </div>

        {/* Decorative corner accents */}
        <svg style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '20px', 
          width: '30px', 
          height: '30px',
          opacity: 0.3 
        }} viewBox="0 0 30 30">
          <path d="M0,0 L30,0 L30,2 L2,2 L2,30 L0,30 Z" fill="#1DB954"/>
        </svg>

        <svg style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '20px', 
          width: '30px', 
          height: '30px',
          opacity: 0.3,
          transform: 'scaleX(-1)'
        }} viewBox="0 0 30 30">
          <path d="M0,0 L30,0 L30,2 L2,2 L2,30 L0,30 Z" fill="#1DB954"/>
        </svg>
      </nav>
    </>
  );
}