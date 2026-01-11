'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMilestoneStore } from '@/store/milestoneStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function MilestoneDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { milestones, deleteMilestone, fetchMilestones } = useMilestoneStore();
  
  const milestone = milestones.find(m => m.id === Number(id));

  useEffect(() => {
    // If not found in current store state, might need to fetch all/specific
    if (!milestone) {
        fetchMilestones();
    }
  }, [milestone, fetchMilestones]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      try {
        await deleteMilestone(Number(id));
        toast.success('Milestone deleted');
        router.push('/milestones');
      } catch (error) {
        toast.error('Failed to delete milestone');
      }
    }
  };

  if (!milestone) return <div className="p-8">Loading or not found...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">{milestone.title}</h1>
            <p className="text-gray-500 mt-1">ID: #{milestone.id}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="danger" onClick={handleDelete}>Delete Milestone</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Details">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`px-2 py-1 rounded-full text-sm ${
                    milestone.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    milestone.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                    {milestone.status}
                </span>
              </dd>
            </div>
             <div>
              <dt className="text-sm font-medium text-gray-500">Risk Level</dt>
              <dd className="mt-1">
                <span className={`px-2 py-1 rounded-full text-sm ${
                    milestone.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                    milestone.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {milestone.riskLevel}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Dates</dt>
              <dd className="mt-1">
                {formatDate(milestone.startDate)} - {formatDate(milestone.endDate)}
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Description">
           <p className="text-gray-700">{milestone.description || 'No description provided.'}</p>
        </Card>
      </div>
    </div>
  );
}
