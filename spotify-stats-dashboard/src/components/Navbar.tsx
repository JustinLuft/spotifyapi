'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#1DB954', color: 'white' }}>
      <Link href="/"><strong>DataGrabber</strong></Link>
      <span style={{ marginLeft: '20px' }}>
        <Link href="/dashboard">Dashboard</Link>
      </span>
    </nav>
  );
}
