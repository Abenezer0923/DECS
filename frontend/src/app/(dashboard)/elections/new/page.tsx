'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useElectionStore } from '@/store/electionStore';
import { CreateElectionForm } from '@/types';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['National', 'ByElection', 'Referendum']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
  message: 'Start date must be before end date',
  path: ['startDate'],
});

type FormData = z.infer<typeof schema>;

export default function CreateElectionPage() {
  const router = useRouter();
  const createElection = useElectionStore((state) => state.createElection);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createElection(data as CreateElectionForm);
      toast.success('Election created successfully');
      router.push('/elections');
    } catch (error) {
      toast.error('Failed to create election');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Election</h1>
      
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Election Name"
            placeholder="e.g., 2026 General Election"
            {...register('name')}
            error={errors.name?.message}
          />

          <Select
            label="Election Type"
            options={[
              { label: 'National Election', value: 'National' },
              { label: 'By-Election', value: 'ByElection' },
              { label: 'Referendum', value: 'Referendum' },
            ]}
            {...register('type')}
            error={errors.type?.message}
            defaultValue=""
          />

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
              Create Election
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
