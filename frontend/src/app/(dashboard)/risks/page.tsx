'use client';

import { useEffect, useState } from 'react';
import { useMilestoneStore } from '@/store/milestoneStore';
import { useRiskStore } from '@/store/riskStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AlertTriangle, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { RiskResponseType } from '@/types';
import { toast } from 'react-hot-toast';

export default function RisksPage() {
  const { milestones, fetchMilestones, loading: milestonesLoading } = useMilestoneStore();
  const { riskResponses, fetchRiskResponses, createRiskResponse, deleteRiskResponse } = useRiskStore();
  
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [newResponse, setNewResponse] = useState<{content: string, type: RiskResponseType}>({
      content: '',
      type: 'FAQ'
  });

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const handleExpand = (id: number) => {
    if (expandedMilestone === id) {
        setExpandedMilestone(null);
    } else {
        setExpandedMilestone(id);
        fetchRiskResponses(id);
    }
  };

  const visibleMilestones = showAll 
      ? milestones 
      : milestones.filter(m => m.riskLevel === 'High' || m.riskLevel === 'Medium');

  const handleSubmit = async (milestoneId: number) => {
      if (!newResponse.content.trim()) return;
      try {
          console.log('Submitting risk response for:', milestoneId);
          await createRiskResponse({
              milestoneId,
              content: newResponse.content,
              type: newResponse.type
          });
          setNewResponse({ content: '', type: 'FAQ' });
          toast.success('Risk response added');
      } catch (error) {
          console.error('Submit error:', error);
          toast.error('Failed to add response');
      }
  };

  const handleDelete = async (id: number, milestoneId: number) => {
      if(confirm('Are you sure?')) {
        await deleteRiskResponse(id, milestoneId);
        toast.success('Deleted');
      }
  };

  if (milestonesLoading && milestones.length === 0) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Risk Management</h1>
        <div className="flex items-center gap-4">
             <div className="text-sm text-gray-500">
                Scanning {milestones.length} milestones. Found {visibleMilestones.length} relevant.
            </div>
            <Button variant="secondary" size="sm" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show High Risk Only' : 'Show All Milestones'}
            </Button>
        </div>
      </div>

      <div className="space-y-4">
        {visibleMilestones.length === 0 ? (
            <Card>
                <div className="text-center py-8 text-gray-500">
                    <p>No High or Medium risk milestones detected.</p>
                    <p className="text-sm mt-2">Try "Show All Milestones" to manage low risk items.</p>
                </div>
            </Card>
        ) : (
            visibleMilestones.map((milestone) => (
                <Card key={milestone.id} className={`border-l-4 ${
                    milestone.riskLevel === 'High' ? 'border-l-red-500' : 
                    milestone.riskLevel === 'Medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                }`}>
                    <div className="flex justify-between items-start cursor-pointer" onClick={() => handleExpand(milestone.id)}>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">{milestone.title}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white 
                                    ${milestone.riskLevel === 'High' ? 'bg-red-500' : 
                                      milestone.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                    {milestone.riskLevel} Risk
                                </span>
                            </div>
                            <p className="text-gray-600 mt-1">{milestone.description}</p>
                            <div className="text-sm text-gray-500 mt-2">
                                Due: {new Date(milestone.endDate).toLocaleDateString()}
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">
                            {expandedMilestone === milestone.id ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                    </div>

                    {expandedMilestone === milestone.id && (
                        <div className="mt-6 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                            <h4 className="font-semibold mb-4 text-gray-700">Mitigation & Responses</h4>
                            
                            <div className="space-y-4 mb-6">
                                {riskResponses[milestone.id]?.map((resp) => (
                                    <div key={resp.id} className="bg-gray-50 p-4 rounded-md flex justify-between group">
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{resp.type}</div>
                                            <p className="text-gray-800 whitespace-pre-wrap">{resp.content}</p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDelete(resp.id, milestone.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(!riskResponses[milestone.id] || riskResponses[milestone.id].length === 0) && (
                                    <p className="text-sm text-gray-400 italic">No responses recorded yet.</p>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                <h5 className="text-sm font-semibold mb-3">Add New Response</h5>
                                <div className="space-y-3">
                                    <Select 
                                        options={[
                                            { label: 'FAQ', value: 'FAQ' },
                                            { label: 'Holding Statement', value: 'HoldingStatement' },
                                            { label: 'Clarification', value: 'Clarification' },
                                            { label: 'Key Message', value: 'KeyMessage' },
                                        ]}
                                        value={newResponse.type}
                                        onChange={(e) => setNewResponse({...newResponse, type: e.target.value as RiskResponseType})}
                                    />
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                                        placeholder="Draft content..."
                                        value={newResponse.content}
                                        onChange={(e) => setNewResponse({...newResponse, content: e.target.value})}
                                    />
                                    <div className="flex justify-end">
                                        <Button size="sm" onClick={() => handleSubmit(milestone.id)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Response
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            ))
        )}
      </div>
    </div>
  );
}
