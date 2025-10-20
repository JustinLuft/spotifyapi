'use client';

import { Suspense } from 'react';
import DashboardContent from './DashboardContent';

export const dynamic = 'force-dynamic'; // <--- add this

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-[#1DB954] p-10">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
