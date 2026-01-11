'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
             <h1 className="text-2xl font-bold text-primary-600">DECS</h1>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
              Dashboard
            </Link>
            <Link href="/elections" className="text-gray-700 hover:text-primary-600">
              Elections
            </Link>
            <Link href="/milestones" className="text-gray-700 hover:text-primary-600">
              Milestones
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user?.username} ({user?.role})
          </span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
