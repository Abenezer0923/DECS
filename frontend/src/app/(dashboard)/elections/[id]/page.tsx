'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useElectionStore } from '@/store/electionStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function ElectionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { elections, deleteElection, fetchElections } = useElectionStore();
  
  // Find election from store (or fetch if not exists - simplified for now)
  const election = elections.find(e => e.id === Number(id));

  useEffect(() => {
    if (!election) {
        fetchElections();
    }
  }, [election, fetchElections]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this election?')) {
      try {
        await deleteElection(Number(id));
        toast.success('Election deleted');
        router.push('/elections');
      } catch (error) {
        toast.error('Failed to delete election');
      }
    }
  };

  if (!election) return <div className="p-8">Loading or not found...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">{election.name}</h1>
            <p className="text-gray-500 mt-1">ID: #{election.id}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="danger" onClick={handleDelete}>Delete Election</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Overview">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-lg">{election.type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  election.status === 'Active' ? 'bg-green-100 text-green-800' : 
                  election.status === 'Planning' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {election.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1">
                {formatDate(election.startDate)} - {formatDate(election.endDate)}
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Milestones">
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No milestones linked yet.</p>
            <Link href={`/milestones/new?electionId=${election.id}`}>
                <Button variant="secondary">Add Milestone</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
