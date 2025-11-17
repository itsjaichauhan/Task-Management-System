// frontend/app/dashboard/layout.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/header';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  // Client-side protection for dashboard pages
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/auth/login');
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-10">
        {children}
      </main>
    </div>
  );
}
