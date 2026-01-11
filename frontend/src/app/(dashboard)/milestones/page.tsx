'use client';

import { useEffect } from 'react';
import { useMilestoneStore } from '@/store/milestoneStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function MilestonesPage() {
  const { milestones, fetchMilestones, loading, error } = useMilestoneStore();
  
  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  if (loading && milestones.length === 0) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

   return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Milestones</h1>
        <Link href="/milestones/new">
          <Button>Create Milestone</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone) => (
          <Card key={milestone.id} className="hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    milestone.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    milestone.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                    {milestone.status}
                </span>
             </div>
             <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>Start: {formatDate(milestone.startDate)}</span>
                <span>End: {formatDate(milestone.endDate)}</span>
             </div>
          </Card>
        ))}
        
        {milestones.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No milestones found.</p>
            </div>
        )}
      </div>
    </div>
   );
}
