import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Transaction } from '../types';

const engagementData = [
    { name: 'Jan', activeMembers: 400, messages: 2400 },
    { name: 'Feb', activeMembers: 300, messages: 1398 },
    { name: 'Mar', activeMembers: 500, messages: 9800 },
    { name: 'Apr', activeMembers: 478, messages: 3908 },
    { name: 'May', activeMembers: 589, messages: 4800 },
    { name: 'Jun', activeMembers: 439, messages: 3800 },
];

const trendData = [
    { name: 'Q1', Technology: 40, Agriculture: 24, Manufacturing: 14 },
    { name: 'Q2', Technology: 30, Agriculture: 13, Manufacturing: 22 },
    { name: 'Q3', Technology: 50, Agriculture: 48, Manufacturing: 20 },
    { name: 'Q4', Technology: 47, Agriculture: 39, Manufacturing: 29 },
];

const mockTransactions: Transaction[] = [
    { id: 'TXN72384', date: '2024-10-25', description: 'Annual Membership Renewal', amount: 1500000, status: 'Completed' },
    { id: 'TXN72380', date: '2024-10-22', description: 'Digital Transformation Summit Ticket', amount: 750000, status: 'Completed' },
    { id: 'TXN72375', date: '2024-10-18', description: 'E-Learning: Export Strategy Masterclass', amount: 450000, status: 'Completed' },
    { id: 'TXN72371', date: '2024-10-15', description: 'Partner Service Fee: Lexis Legal', amount: 2500000, status: 'Pending' },
    { id: 'TXN72368', date: '2024-10-11', description: 'Donation to KADIN Peduli', amount: 500000, status: 'Completed' },
    { id: 'TXN72365', date: '2024-10-09', description: 'Membership Upgrade Fee', amount: 1000000, status: 'Failed' },
];

const ChartCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-kadin-light-navy p-6 rounded-lg border border-gray-700 ${className}`}>
        <h3 className="text-xl font-bold text-kadin-white mb-4">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            {children}
        </div>
    </div>
);

const statusColors: { [key in Transaction['status']]: string } = {
    Completed: 'bg-green-500/10 text-green-400',
    Pending: 'bg-yellow-500/10 text-yellow-400',
    Failed: 'bg-red-500/10 text-red-400',
};

const Insight: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-6">Insights & Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Member Engagement">
                    <ResponsiveContainer>
                        <BarChart data={engagementData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="name" stroke="#a8b2d1" />
                            <YAxis stroke="#a8b2d1" />
                            <Tooltip contentStyle={{ backgroundColor: '#172A45', border: '1px solid #4A5568' }} />
                            <Legend />
                            <Bar dataKey="activeMembers" fill="#D4AF37" name="Active Members" />
                            <Bar dataKey="messages" fill="#4299E1" name="Messages Sent" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Business Matching Trends by Industry">
                    <ResponsiveContainer>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="name" stroke="#a8b2d1" />
                            <YAxis stroke="#a8b2d1" />
                            <Tooltip contentStyle={{ backgroundColor: '#172A45', border: '1px solid #4A5568' }} />
                            <Legend />
                            <Line type="monotone" dataKey="Technology" stroke="#D4AF37" />
                            <Line type="monotone" dataKey="Agriculture" stroke="#38B2AC" />
                            <Line type="monotone" dataKey="Manufacturing" stroke="#9F7AEA" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <div className="lg:col-span-2">
                     <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold text-kadin-white mb-4">Transaction History</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-kadin-slate">
                                <thead className="text-xs text-kadin-light-slate uppercase bg-kadin-navy">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Description</th>
                                        <th scope="col" className="px-6 py-3 text-right">Amount (IDR)</th>
                                        <th scope="col" className="px-6 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockTransactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-gray-700 hover:bg-kadin-navy">
                                            <td className="px-6 py-4 font-medium text-kadin-white whitespace-nowrap">{tx.date}</td>
                                            <td className="px-6 py-4">{tx.description}</td>
                                            <td className="px-6 py-4 text-right font-medium text-kadin-white">{tx.amount.toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[tx.status]}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insight;