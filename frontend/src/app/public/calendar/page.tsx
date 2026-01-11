'use client';

import { useEffect, useState } from 'react';
import { usePublicStore } from '@/store/publicStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Calendar, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';

const languages = [
    { label: 'English', value: 'en' },
    { label: 'Amharic', value: 'am' },
    { label: 'Oromo', value: 'om' },
    { label: 'Tigrinya', value: 'ti' },
    { label: 'Somali', value: 'so' },
    { label: 'Afar', value: 'aa' },
];

export default function PublicCalendarPage() {
    const { entries, fetchPublicCalendar, loading } = usePublicStore();
    const [lang, setLang] = useState('en');

    useEffect(() => {
        fetchPublicCalendar(lang);
    }, [lang, fetchPublicCalendar]);

    const getStatusIcon = (status: string) => {
        switch(status){
            case 'Completed': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            case 'Ongoing': return <PlayCircle className="w-6 h-6 text-blue-500" />;
            default: return <Clock className="w-6 h-6 text-gray-400" />;
        }
    };

    const getPhaseColor = (status: string) => {
        switch(status){
            case 'Completed': return 'border-l-green-500 bg-green-50/50';
            case 'Ongoing': return 'border-l-blue-500 bg-blue-50/50 shadow-md transform scale-[1.01] transition-transform';
            case 'Delayed': return 'border-l-red-500 bg-red-50/50';
            default: return 'border-l-gray-300';
        }
    };

    const currentEvent = entries.find(e => e.milestone.status === 'Ongoing');

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                     <h2 className="text-3xl font-bold text-gray-900">Election Milestones</h2>
                     <p className="text-gray-500 mt-1">Status of key election phases and deadlines</p>
                </div>
                <div className="w-40">
                     <Select 
                        value={lang} 
                        onChange={(e) => setLang(e.target.value)}
                        options={languages}
                     />
                </div>
            </div>

            {/* Hero Section: Ongoing Event */}
            {currentEvent && (
                <div className="mb-12 bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                    <div className="bg-blue-600 px-6 py-2 text-white text-sm font-bold uppercase tracking-wide">
                        Happening Now
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-bold mb-3 text-gray-900">{currentEvent.publicTitle}</h3>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{currentEvent.publicDescription}</p>
                        <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <span>Ends {format(new Date(currentEvent.milestone.endDate), 'MMMM d, yyyy')}</span>
                            </div>
                            {/* Countdown logic could be added here */}
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                {entries.map((entry, index) => (
                    <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Dot on timeline */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 
                            ${entry.milestone.status === 'Completed' ? 'bg-green-500' : 
                              entry.milestone.status === 'Ongoing' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                            {getStatusIcon(entry.milestone.status)}
                        </div>
                        
                        {/* Content Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
                            <div className={`p-6 rounded-lg border-l-4 shadow-sm bg-white ${getPhaseColor(entry.milestone.status)}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded 
                                        ${entry.milestone.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}>
                                        {format(new Date(entry.milestone.startDate), 'MMM d')} - {format(new Date(entry.milestone.endDate), 'MMM d')}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">{entry.publicTitle}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {entry.publicDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading calendar...</p>
                </div>
            )}
            
            {!loading && entries.length === 0 && (
                <div className="py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No public milestones have been published yet.</p>
                </div>
            )}
        </div>
    );
}
