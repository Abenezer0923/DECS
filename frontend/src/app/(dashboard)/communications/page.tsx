'use client';

import { useEffect } from 'react';
import { useCommunicationStore } from '@/store/communicationStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { getStatusColor } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function CommunicationsPage() {
  const { communications, fetchCommunications, updateCommunication, loading, error } = useCommunicationStore();

  useEffect(() => {
    fetchCommunications();
  }, [fetchCommunications]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      // Cast to any because the type definition might expect full object if not Partial
      // But my store updateCommunication implementation takes Partial.
      // Actually strictly speaking status is typed as specific string union.
      await updateCommunication(id, { status: newStatus as any });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  if (loading && communications.length === 0) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Communications</h1>
        <Link href="/communications/new">
          <Button>Create Communication</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communications.map((comm) => (
          <Card key={comm.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
             <div>
               <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-lg">{comm.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(comm.status)}`}>
                      {comm.status}
                  </span>
               </div>
               
               {comm.milestone && (
                   <div className="text-sm text-gray-500 mb-2">
                      Milestone: {comm.milestone.title}
                   </div>
               )}

               <div className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {comm.contentDraft || 'No content draft yet.'}
               </div>

               <div className="text-xs text-gray-400 mb-4">
                  Target: {comm.targetAudience}
               </div>
             </div>

             <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                {comm.status === 'Draft' && (
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleStatusChange(comm.id, 'PendingApproval')}
                    className="w-full"
                  >
                    Request Approval
                  </Button>
                )}
                {comm.status === 'PendingApproval' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange(comm.id, 'Published')}
                     className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Publish
                  </Button>
                )}
                {comm.status === 'Published' && (
                   <span className="text-xs text-gray-500 italic w-full text-center">Published & Notified</span>
                )}
             </div>
          </Card>
        ))}
        
        {communications.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No communications found.</p>
            </div>
        )}
      </div>
    </div>
  );
}
