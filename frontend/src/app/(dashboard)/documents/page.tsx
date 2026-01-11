'use client';

import { useState, useEffect } from 'react';
import { useMilestoneStore } from '@/store/milestoneStore';
import { useDocumentStore } from '@/store/documentStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge'; // Assume Badge exists or use raw span
import { FileText, Upload, Trash2, Download, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/Input';

export default function DocumentsPage() {
  const { milestones, fetchMilestones } = useMilestoneStore();
  const { documents, fetchDocuments, uploadDocument, deleteDocument, downloadDocument, loading } = useDocumentStore();
  
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  useEffect(() => {
     if (selectedMilestone) {
         fetchDocuments(selectedMilestone);
     }
  }, [selectedMilestone, fetchDocuments]);

  // Handle file selection
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !selectedMilestone) return;

      setIsUploading(true);
      try {
          await uploadDocument(selectedMilestone, file);
          toast.success('Document uploaded');
          // Clear input
          e.target.value = '';
      } catch (error) {
          toast.error('Upload failed');
      } finally {
          setIsUploading(false);
      }
  };

  const handleDelete = async (id: number) => {
      if(!selectedMilestone) return;
      if (confirm('Delete this document?')) {
          await deleteDocument(id, selectedMilestone);
          toast.success('Document deleted');
      }
  };

  const filteredMilestones = milestones.filter(m => 
      m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Document Repository</h1>
      </div>

      <div className="grid grid-cols-12 gap-6 h-full min-h-0">
          {/* Sidebar: Milestones List */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold mb-2">Select Milestone</h2>
                  <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input 
                        placeholder="Search..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {filteredMilestones.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMilestone(m.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedMilestone === m.id 
                            ? 'bg-primary-50 text-primary-700 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                          {m.title}
                      </button>
                  ))}
                  {filteredMilestones.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                          No milestones found.
                      </div>
                  )}
              </div>
          </div>

          {/* Main Area: Document List */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col h-full min-h-0">
             {!selectedMilestone ? (
                 <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                     <FileText className="w-12 h-12 mb-4 opacity-50" />
                     <p>Select a milestone to view documents</p>
                 </div>
             ) : (
                 <Card className="h-full flex flex-col">
                     <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                         <div>
                             <h2 className="text-xl font-bold">
                                 {milestones.find(m => m.id === selectedMilestone)?.title}
                             </h2>
                             <p className="text-sm text-gray-500">Document Management</p>
                         </div>
                         <div>
                             <input 
                                type="file" 
                                id="file-upload" 
                                className="hidden" 
                                onChange={handleFileUpload}
                                disabled={isUploading}
                             />
                                     <label htmlFor="file-upload" className="cursor-pointer">
                                         <span className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 h-10 px-4">
                                             <Upload className="w-4 h-4 mr-2" />
                                             Upload File
                                         </span>
                                     </label>
                                 </div>
                     </div>

                     <div className="flex-1 overflow-y-auto">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {documents[selectedMilestone]?.map((doc) => (
                                 <div key={doc.id} className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all group bg-white">
                                     <div className="flex items-start justify-between mb-2">
                                         <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                            <FileText className="w-6 h-6" />
                                         </div>
                                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => downloadDocument(doc.id, doc.filePath.split(/[\\\/]/).pop() || `doc_${doc.id}`)}
                                             >
                                                 <Download className="w-4 h-4 text-gray-600" />
                                             </Button>
                                             <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleDelete(doc.id)}
                                             >
                                                 <Trash2 className="w-4 h-4 text-red-500" />
                                             </Button>
                                         </div>
                                     </div>
                                     <div className="mt-2">
                                         <p className="font-medium text-sm truncate" title={doc.filePath.split(/[\\\/]/).pop()}>
                                             {doc.filePath.split(/[\\\/]/).pop()?.split('-').slice(1).join('-')}
                                         </p>
                                         <p className="text-xs text-gray-500 mt-1">
                                             Uploaded by {doc.uploader?.username || 'Unknown'}
                                         </p>
                                         <p className="text-xs text-gray-400">
                                             {new Date(doc.uploadedAt).toLocaleDateString()}
                                         </p>
                                     </div>
                                 </div>
                             ))}
                             
                             {(!documents[selectedMilestone] || documents[selectedMilestone].length === 0) && (
                                 <div className="col-span-full py-12 text-center text-gray-400 italic">
                                     No documents uploaded for this milestone yet.
                                 </div>
                             )}
                         </div>
                     </div>
                 </Card>
             )}
          </div>
      </div>
    </div>
  );
}

