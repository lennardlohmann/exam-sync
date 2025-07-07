'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import { useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  if (isLanding) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  return (
    <div className="flex">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <div
        className={`min-h-screen flex-1 transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-16'}`}
      >
        {children}
        <Toaster />
      </div>
    </div>
  );
}
