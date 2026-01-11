'use client';

import { useEffect, useState } from 'react';
import { useAuditStore } from '@/store/auditStore';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RefreshCw, Search, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogsPage() {
  const { logs, fetchLogs, loading, error } = useAuditStore();
  const [tableFilter, setTableFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs({ limit: 100 });
  }, [fetchLogs]);

  const handleRefresh = () => {
    fetchLogs({ 
        entityTable: tableFilter || undefined,
        limit: 100 
    });
  };

  useEffect(() => {
      // Auto-refresh when filter changes
      fetchLogs({ 
          entityTable: tableFilter || undefined, 
          limit: 100 
      });
  }, [tableFilter, fetchLogs]);

  // Client-side search for username or action details
  const filteredLogs = logs.filter(log => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
          log.user?.username.toLowerCase().includes(term) ||
          log.action.toLowerCase().includes(term) ||
          log.entityTable.toLowerCase().includes(term)
      );
  });

  if (error && logs.length === 0) return (
      <div className="p-8 text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <p className="text-sm text-gray-500 mt-4">Only Administrators can view audit logs.</p>
      </div>
  );

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Audit Logs</h1>
        <Button variant="secondary" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex gap-4 mb-6 pt-1">
              <div className="w-64">
                <Select
                    label="Entity Type"
                    value={tableFilter}
                    onChange={(e) => setTableFilter(e.target.value)}
                    options={[
                        { label: 'All Entities', value: '' },
                        { label: 'Milestone', value: 'Milestone' },
                        { label: 'User', value: 'User' },
                        { label: 'Document', value: 'Document' },
                        { label: 'Communication', value: 'CommunicationAction' },
                        { label: 'Risk Response', value: 'RiskResponse' },
                    ]}
                />
              </div>
              <div className="flex-1">
                 <div className="relative mt-7"> {/* Align with Select visually (label height) */}
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                          placeholder="Search user, action..."
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                 </div>
              </div>
          </div>

          <div className="flex-1 overflow-auto border rounded-md">
              <table className="min-w-full divide-y divide-gray-200 relative">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{log.user?.username || 'System'}</div>
                                  <div className="text-xs text-gray-500">{log.user?.role?.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${log.action === 'CREATE' ? 'bg-green-100 text-green-800' : 
                                      log.action === 'DELETE' ? 'bg-red-100 text-red-800' : 
                                      log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                      {log.action}
                                  </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {log.entityTable} <span className="text-xs text-gray-400">#{log.entityId}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={JSON.stringify(log.newValues || log.oldValues)}>
                                  {log.newValues ? (
                                      <span className="font-mono text-xs">
                                          {Object.keys(log.newValues).length} fields changed
                                      </span>
                                  ) : (
                                      <span className="text-gray-400 text-xs">-</span>
                                  )}
                              </td>
                          </tr>
                      ))}
                      {filteredLogs.length === 0 && !loading && (
                          <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                  No logs found.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </Card>
    </div>
  );
}
