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
import { useCommunicationStore } from '@/store/communicationStore';
import { useMilestoneStore } from '@/store/milestoneStore';
import { CreateCommunicationForm } from '@/types';

const schema = z.object({
  milestoneId: z.string().min(1, 'Milestone is required'),
  type: z.enum(['PressRelease', 'SocialMedia', 'SMS', 'WebsiteUpdate']),
  contentDraft: z.string().optional(),
  targetAudience: z.string().optional(),
  language: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateCommunicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const milestoneIdParam = searchParams.get('milestoneId');

  const { createCommunication } = useCommunicationStore();
  const { milestones, fetchMilestones } = useMilestoneStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
        milestoneId: milestoneIdParam || '',
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createCommunication({
          ...data,
          milestoneId: Number(data.milestoneId),
      } as CreateCommunicationForm); // Type assertion if needed or ensure types align
      toast.success('Communication draft created');
      router.push('/communications');
    } catch (error) {
      toast.error('Failed to create communication');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Communication Draft</h1>
      
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Select
            label="Related Milestone"
            options={milestones.map(m => ({ label: m.title, value: m.id.toString() }))}
            {...register('milestoneId')}
            error={errors.milestoneId?.message}
          />

          <Select
            label="Type"
            options={[
                { label: 'Press Release', value: 'PressRelease' },
                { label: 'Social Media', value: 'SocialMedia' },
                { label: 'SMS', value: 'SMS' },
                { label: 'Website Update', value: 'WebsiteUpdate' },
            ]}
            {...register('type')}
            error={errors.type?.message}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Draft</label>
            <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={5}
                placeholder="Write your draft here..."
                {...register('contentDraft')}
            />
          </div>

          <Input
            label="Target Audience"
            placeholder="e.g., General Public, Media, Voters in Region X"
            {...register('targetAudience')}
            error={errors.targetAudience?.message}
          />
          
           <Input
            label="Language"
            placeholder="e.g., en, am"
            {...register('language')}
            error={errors.language?.message}
          />

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
              Create Draft
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
