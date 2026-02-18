import React from 'react';
import { CommunityGroup, CommunityEvent } from '../types';

const mockGroups: CommunityGroup[] = [
    { id: 1, name: 'Digital Innovators Network', description: 'A community for tech entrepreneurs and innovators to discuss emerging technologies like AI, Blockchain, and IoT.', members: 1250, imageUrl: 'https://picsum.photos/seed/group1/400/200', category: 'Technology' },
    { id: 2, name: 'Sustainable Agriculture Alliance', description: 'Connecting farmers, exporters, and technologists to promote sustainable and profitable agricultural practices.', members: 875, imageUrl: 'https://picsum.photos/seed/group2/400/200', category: 'Agriculture' },
    { id: 3, name: 'Export Leaders Forum', description: 'An exclusive group for members to share insights on international trade, logistics, and accessing global markets.', members: 620, imageUrl: 'https://picsum.photos/seed/group3/400/200', category: 'Trade' },
];

const mockEvents: CommunityEvent[] = [
    { id: 1, title: 'AI in Business: A Practical Webinar', group: 'Digital Innovators Network', date: 'Nov 10, 2024', location: 'Online', imageUrl: 'https://picsum.photos/seed/event1/400/200' },
    { id: 2, title: 'Green Tech Pitch Night', group: 'Sustainable Agriculture Alliance', date: 'Nov 15, 2024', location: 'Jakarta', imageUrl: 'https://picsum.photos/seed/event2/400/200' },
    { id: 3, title: 'Global Trade Summit Mixer', group: 'Export Leaders Forum', date: 'Nov 22, 2024', location: 'Surabaya', imageUrl: 'https://picsum.photos/seed/event3/400/200' },
    { id: 4, title: 'IoT for Smart Factories', group: 'Digital Innovators Network', date: 'Dec 05, 2024', location: 'Online', imageUrl: 'https://picsum.photos/seed/event4/400/200' },
];

const GroupCard: React.FC<{ group: CommunityGroup }> = ({ group }) => (
    <div className="bg-kadin-light-navy rounded-lg overflow-hidden border border-gray-700 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer hover:border-kadin-gold/50 group" onClick={() => alert(`Navigating to group: ${group.name}`)}>
        <img src={group.imageUrl} alt={group.name} className="w-full h-40 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <span className="text-xs font-semibold text-kadin-gold bg-kadin-gold/10 px-2 py-1 rounded-full self-start">{group.category}</span>
            <h3 className="text-lg font-bold mt-2 text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">{group.name}</h3>
            <p className="text-sm mt-2 text-kadin-slate flex-grow">{group.description}</p>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center text-sm text-kadin-light-slate">
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    {group.members.toLocaleString()} members
                </div>
                <button className="bg-kadin-gold text-kadin-navy font-bold py-2 px-4 rounded-lg text-sm hover:bg-yellow-400 transition-colors" onClick={(e) => e.stopPropagation()}>
                    Join Group
                </button>
            </div>
        </div>
    </div>
);

const EventCard: React.FC<{ event: CommunityEvent }> = ({ event }) => (
    <div className="bg-kadin-light-navy rounded-lg overflow-hidden border border-gray-700 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer hover:border-kadin-gold/50 group" onClick={() => alert(`Navigating to event: ${event.title}`)}>
        <img src={event.imageUrl} alt={event.title} className="w-full h-32 object-cover"/>
        <div className="p-4 flex flex-col flex-grow">
            <h4 className="font-bold text-kadin-white flex-grow transition-colors duration-200 group-hover:text-kadin-gold">{event.title}</h4>
            <p className="text-xs text-kadin-gold mt-1">{event.group}</p>
            <div className="text-sm text-kadin-slate mt-4 space-y-2">
                <div className="flex items-center">
                     <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {event.date}
                </div>
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {event.location}
                </div>
            </div>
            <button className="mt-4 w-full border border-kadin-gold text-kadin-gold font-semibold py-2 rounded-lg text-sm hover:bg-kadin-gold hover:text-kadin-navy transition-colors" onClick={(e) => e.stopPropagation()}>
                View Details
            </button>
        </div>
    </div>
);


const Community: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-6">Community Hub</h2>

            <div className="bg-kadin-light-navy/50 p-4 rounded-lg border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <input type="text" placeholder="Search groups or events..." className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full"/>
                <select className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto">
                    <option>All Categories</option>
                    <option>Technology</option>
                    <option>Agriculture</option>
                    <option>Trade</option>
                </select>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-kadin-white mb-4">Featured Groups</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockGroups.map(group => <GroupCard key={group.id} group={group} />)}
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-2xl font-bold text-kadin-white mb-4">Upcoming Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {mockEvents.map(event => <EventCard key={event.id} event={event} />)}
                </div>
            </div>
        </div>
    );
};

export default Community;