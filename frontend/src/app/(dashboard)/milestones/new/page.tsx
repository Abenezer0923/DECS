'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useMilestoneStore } from '@/store/milestoneStore';
import { useElectionStore } from '@/store/electionStore';
import { CreateMilestoneForm } from '@/types';

const schema = z.object({
  electionCycleId: z.string().min(1, 'Election is required'),
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  // isStatutory is boolean, tricky with select/checkbox in this setup, defaulting to false or handling separately
  status: z.enum(['Planned', 'Ongoing', 'Completed', 'Delayed', 'Cancelled']).default('Planned'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).default('Low'),
});

type FormData = z.infer<typeof schema>;

export default function CreateMilestonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const electionIdParam = searchParams.get('electionId');

  const { createMilestone } = useMilestoneStore();
  const { elections, fetchElections } = useElectionStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
        electionCycleId: electionIdParam || '',
        status: 'Planned',
        riskLevel: 'Low'
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createMilestone({
          ...data,
          electionCycleId: Number(data.electionCycleId),
          isStatutory: true // Defaulting for now as I don't have checkbox component ready
      } as CreateMilestoneForm);
      toast.success('Milestone created successfully');
      router.push('/milestones');
    } catch (error) {
      toast.error('Failed to create milestone');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Milestone</h1>
      
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Select
            label="Election Cycle"
            options={elections.map(e => ({ label: e.name, value: e.id.toString() }))}
            {...register('electionCycleId')}
            error={errors.electionCycleId?.message}
          />

          <Input
            label="Milestone Title"
            placeholder="e.g., Voter Registration"
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
            />

            <Input
              label="End Date"
              type="date"
              {...register('endDate')}
              error={errors.endDate?.message}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select
                label="Status"
                options={[
                    { label: 'Planned', value: 'Planned' },
                    { label: 'Ongoing', value: 'Ongoing' },
                ]}
                {...register('status')}
            />
            <Select
                label="Risk Level"
                options={[
                    { label: 'Low', value: 'Low' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'High', value: 'High' },
                ]}
                {...register('riskLevel')}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Create Milestone
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
