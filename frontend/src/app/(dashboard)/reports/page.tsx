'use client';

import { useEffect } from 'react';
import { useReportStore } from '@/store/reportStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, FileText } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = {
  Completed: '#4caf50',
  Ongoing: '#2196f3',
  Delayed: '#d32f2f',
  Planned: '#ffc107',
  Other: '#9e9e9e'
};

export default function ReportsPage() {
  const { report, loading, error, fetchReport, downloadReport } = useReportStore();

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (loading && !report) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  const data = report ? [
     { name: 'Completed', value: report.stats.completed },
     { name: 'Ongoing', value: report.stats.ongoing },
     { name: 'Delayed', value: report.stats.delayed },
     { name: 'Planned', value: report.stats.planned },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Progress Reports</h1>
        <div className="flex gap-3">
            <Button variant="secondary" onClick={() => downloadReport('excel')}>
                <FileText className="w-4 h-4 mr-2" />
                Export Excel
            </Button>
            <Button onClick={() => downloadReport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
            </Button>
        </div>
      </div>

      {report && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             <Card title="Total Milestones">
                <p className="text-3xl font-bold">{report.stats.total}</p>
             </Card>
             <Card title="Completed">
                <p className="text-3xl font-bold text-green-600">{report.stats.completed}</p>
             </Card>
             <Card title="Delayed">
                <p className="text-3xl font-bold text-red-600">{report.stats.delayed}</p>
             </Card>
             <Card title="Completion Rate">
                <p className="text-3xl font-bold text-blue-600">
                    {report.stats.total > 0 ? Math.round((report.stats.completed / report.stats.total) * 100) : 0}%
                </p>
             </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
          <Card key="chart-card" className="md:col-span-1" title="Milestone Status Distribution">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Other} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
          </Card>

          <Card key="recent-card" className="md:col-span-2" title="Milestones Summary">
             <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                     <thead>
                         <tr>
                             <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                             <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                             <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                         </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                         {report?.milestones.slice(0, 5).map((m) => (
                             <tr key={m.id}>
                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{m.title}</td>
                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                     {new Date(m.startDate).toLocaleDateString()}
                                 </td>
                                 <td className="px-3 py-2 whitespace-nowrap">
                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${m.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                          m.status === 'Delayed' ? 'bg-red-100 text-red-800' : 
                                          m.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                         {m.status}
                                     </span>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
          </Card>
      </div>
    </div>
  );
}
