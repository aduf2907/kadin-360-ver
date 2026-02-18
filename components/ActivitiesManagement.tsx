import React, { useState } from 'react';
import { KadinActivity } from '../types';

// --- Mock Data ---
const mockActivities: KadinActivity[] = [
    { id: 1, title: 'Prepare Q4 Financial Report', description: 'Compile all financial data from the last quarter for the board meeting.', assignee: { name: 'Citra Lestari', avatar: 'https://picsum.photos/id/1011/40/40' }, dueDate: '2024-11-10', priority: 'High', status: 'In Progress' },
    { id: 2, title: 'Organize Annual Networking Mixer Event', description: 'Coordinate with vendors, send out invitations, and manage registrations.', assignee: { name: 'Andi Wijaya', avatar: 'https://picsum.photos/id/1027/40/40' }, dueDate: '2024-11-20', priority: 'High', status: 'To Do' },
    { id: 3, title: 'Draft Press Release for New Partnership', description: 'Write a compelling press release about the new partnership with FinPro Consulting.', assignee: { name: 'Bambang Susilo', avatar: 'https://picsum.photos/id/1015/40/40' }, dueDate: '2024-11-05', priority: 'Medium', status: 'In Progress' },
    { id: 4, title: 'Update Member Directory with New Entries', description: 'Add the 50 new members from the October intake to the online directory.', assignee: { name: 'Rina Hartono', avatar: 'https://picsum.photos/id/1012/40/40' }, dueDate: '2024-11-08', priority: 'Low', status: 'To Do' },
    { id: 5, title: 'Review 2023 Annual Report', description: 'Final review and proofreading of the 2023 annual report before publication.', assignee: { name: 'Budi Santoso', avatar: 'https://picsum.photos/100' }, dueDate: '2024-10-25', priority: 'Medium', status: 'Completed' },
    { id: 6, title: 'Onboard New KADIN Partner: Lexis Legal', description: 'Complete the onboarding process and add them to the Mitra KADIN page.', assignee: { name: 'Rina Hartono', avatar: 'https://picsum.photos/id/1012/40/40' }, dueDate: '2024-10-30', priority: 'Medium', status: 'Completed' },
];

const assignees = [...new Map(mockActivities.map(item => [item.assignee.name, item.assignee])).values()];
// --- End Mock Data ---


const priorityConfig = {
    High: { color: 'bg-red-500', label: 'High' },
    Medium: { color: 'bg-yellow-500', label: 'Medium' },
    Low: { color: 'bg-blue-500', label: 'Low' },
};

const columnConfig: { [key in KadinActivity['status']]: { title: string, color: string } } = {
    'To Do': { title: 'To Do', color: 'border-gray-500' },
    'In Progress': { title: 'In Progress', color: 'border-blue-500' },
    'Completed': { title: 'Completed', color: 'border-green-500' },
};


const ActivityCard: React.FC<{ activity: KadinActivity }> = ({ activity }) => {
    const isOverdue = new Date(activity.dueDate) < new Date() && activity.status !== 'Completed';
    const priority = priorityConfig[activity.priority];

    return (
        <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-4 cursor-grab hover:shadow-lg hover:border-kadin-gold/50 transition-all duration-200">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-kadin-white pr-2">{activity.title}</h4>
                <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${priority.color}`} title={`Priority: ${priority.label}`}></div>
            </div>
            <p className="text-xs text-kadin-slate mt-2">{activity.description}</p>
            <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-700/50">
                <div className="flex items-center">
                    <img src={activity.assignee.avatar} alt={activity.assignee.name} className="w-6 h-6 rounded-full mr-2 border-2 border-gray-600" />
                    <span className="text-xs font-semibold text-kadin-light-slate">{activity.assignee.name}</span>
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded ${isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-kadin-slate'}`}>
                    <svg className="inline-block w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {new Date(activity.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </div>
            </div>
        </div>
    );
};

const BoardColumn: React.FC<{ status: KadinActivity['status']; activities: KadinActivity[] }> = ({ status, activities }) => {
    const config = columnConfig[status];
    return (
        <div className="bg-kadin-navy/50 rounded-lg p-3 w-full">
            <h3 className={`font-bold text-kadin-white border-b-4 pb-2 mb-4 ${config.color} flex justify-between`}>
                <span>{config.title}</span>
                <span className="bg-gray-700 text-kadin-light-slate text-sm font-semibold rounded-full px-2">{activities.length}</span>
            </h3>
            <div className="space-y-4 h-[calc(100vh-25rem)] overflow-y-auto pr-2">
                {activities.map(activity => <ActivityCard key={activity.id} activity={activity} />)}
            </div>
        </div>
    );
};


const ActivitiesManagement: React.FC = () => {
    const [activities] = useState<KadinActivity[]>(mockActivities);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAssignee, setFilterAssignee] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) || activity.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAssignee = filterAssignee === 'All' || activity.assignee.name === filterAssignee;
        const matchesPriority = filterPriority === 'All' || activity.priority === filterPriority;
        return matchesSearch && matchesAssignee && matchesPriority;
    });

    const activitiesByStatus = {
        'To Do': filteredActivities.filter(a => a.status === 'To Do'),
        'In Progress': filteredActivities.filter(a => a.status === 'In Progress'),
        'Completed': filteredActivities.filter(a => a.status === 'Completed'),
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-kadin-white">Activities Management</h2>
                <button className="bg-kadin-gold text-kadin-navy font-bold py-2 px-5 rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Create New Activity
                </button>
            </div>

            {/* Filters */}
            <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center flex-wrap">
                <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:flex-1"
                />
                <select
                    value={filterAssignee}
                    onChange={(e) => setFilterAssignee(e.target.value)}
                    className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
                >
                    <option value="All">All Assignees</option>
                    {assignees.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                </select>
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
                >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.keys(activitiesByStatus).map(status => (
                    <BoardColumn 
                        key={status} 
                        status={status as KadinActivity['status']} 
                        activities={activitiesByStatus[status as KadinActivity['status']]} 
                    />
                ))}
            </div>
        </div>
    );
};

export default ActivitiesManagement;