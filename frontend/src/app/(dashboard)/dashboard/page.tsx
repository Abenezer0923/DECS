'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api';
import { DashboardStats } from '@/types';

import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Fetch dashboard stats
    apiClient.get<DashboardStats>('/dashboard/stats')
      .then(setStats)
      .catch((err) => {
        // Fallback for demo or if endpoint fails
        console.error(err);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-sans text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/elections">
          <Card title="Total Elections" className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <p className="text-4xl font-bold text-gray-900">{stats?.totalElections || 0}</p>
          </Card>
        </Link>
        
        <Link href="/milestones">
          <Card title="Active Milestones" className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <p className="text-4xl font-bold text-blue-600">{stats?.activeMilestones || 0}</p>
          </Card>
        </Link>
        
        <Link href="/communications">
          <Card title="Pending Communications" className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <p className="text-4xl font-bold text-yellow-600">{stats?.pendingCommunications || 0}</p>
          </Card>
        </Link>
        
        <Link href="/milestones">
          <Card title="Delayed Milestones" className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <p className="text-4xl font-bold text-red-600">
              {stats?.delayedMilestones || 0}
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
