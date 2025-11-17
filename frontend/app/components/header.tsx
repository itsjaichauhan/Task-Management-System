// frontend/app/components/header.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';
import Button from '@/app/components/ui/button';
export default function Header() {
  const router = useRouter();
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
      // Clear local storage regardless of API response for client-side logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      // Handle error but still proceed with client-side clear
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      toast.error('Logout failed, but you have been logged out on the client side.');
      router.push('/auth/login');
    }
  };
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
          Task Manager
        </Link>
        <Button 
          onClick={handleLogout} 
          variant="ghost" 
          className="text-gray-600 hover:text-indigo-600"
        >
          <LogOut className="w-5 h-5 mr-1" />
          Logout
        </Button>
      </div>
    </header>
  );
}
