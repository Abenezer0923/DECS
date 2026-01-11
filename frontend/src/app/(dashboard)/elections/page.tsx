'use client';

import { useEffect } from 'react';
import { useElectionStore } from '@/store/electionStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function ElectionsPage() {
  const { elections, fetchElections, loading, error } = useElectionStore();

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  if (loading && elections.length === 0) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Elections</h1>
        <Link href="/elections/new">
          <Button>Create Election</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {elections.map((election) => (
          <Card key={election.id} title={election.name} className="hover:shadow-md transition-shadow">
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{election.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  election.status === 'Active' ? 'bg-green-100 text-green-800' : 
                  election.status === 'Planning' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {election.status}
                </span>
              </div>
              <div className="text-sm text-gray-500 pt-2 border-t mt-2">
                 {formatDate(election.startDate)} - {formatDate(election.endDate)}
              </div>
              
              <div className="pt-4 flex gap-2">
                 <Link href={`/elections/${election.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full text-sm">View Details</Button>
                 </Link>
              </div>
            </div>
          </Card>
        ))}
        
        {elections.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No elections found. Create your first one!</p>
            </div>
        )}
      </div>
    </div>
  );
}
