'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Elections', href: '/elections', icon: '🗳️' },
  { name: 'Milestones', href: '/milestones', icon: '📅' },
  { name: 'Communications', href: '/communications', icon: '📢' },
  { name: 'Reports', href: '/reports', icon: '📈' },
  { name: 'Risks', href: '/risks', icon: '⚠️' },
  { name: 'Documents', href: '/documents', icon: '📄' },
  { name: 'Audit Logs', href: '/audit-logs', icon: '📋' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-2 rounded-md transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
