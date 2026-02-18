import React, { useState, useEffect } from 'react';
import { DiscussionThread } from '../types';

const mockThreads: DiscussionThread[] = [
    { id: 1, title: 'Regulatory Update: New Export Tax Policy', category: 'Investment & Policy', author: 'Rina Hartono', authorAvatar: 'https://picsum.photos/id/1012/40/40', replies: 15, lastActivity: '2h ago' },
    { id: 2, title: 'Opportunities in the Renewable Energy Sector', category: 'Energy & Resources', author: 'Admin', authorAvatar: 'https://picsum.photos/id/1/40/40', replies: 8, lastActivity: '5h ago' },
    { id: 3, title: 'Best Practices for Digital Marketing in B2B', category: 'Marketing', author: 'Bambang Susilo', authorAvatar: 'https://picsum.photos/id/1015/40/40', replies: 22, lastActivity: '1d ago' },
    { id: 4, title: 'Challenges in Supply Chain for Manufacturing', category: 'Manufacturing', author: 'Andi Wijaya', authorAvatar: 'https://picsum.photos/id/1027/40/40', replies: 5, lastActivity: '3d ago' },
];

/**
 * Calculates the Levenshtein distance between two strings.
 */
const levenshteinDistance = (s1: string, s2: string): number => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0) costs[j] = j;
            else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
};

/**
 * Performs a fuzzy search to check if a query matches a text.
 */
const fuzzySearch = (query: string, text: string): boolean => {
    const queryTokens = query.toLowerCase().split(' ').filter(t => t);
    if (queryTokens.length === 0) return true;
    const textTokens = text.toLowerCase().split(/[\s,.\-_]+/);
    return queryTokens.every(qToken => 
        textTokens.some(tToken => {
            const allowedDistance = Math.floor((qToken.length - 1) / 4);
            return tToken.startsWith(qToken) || levenshteinDistance(qToken, tToken) <= allowedDistance;
        })
    );
};


const ThreadItem: React.FC<{ thread: DiscussionThread }> = ({ thread }) => (
    <div className="flex items-center p-4 bg-kadin-light-navy hover:bg-kadin-navy rounded-lg border border-gray-700 transition-all duration-300 cursor-pointer hover:border-kadin-gold/50 group transform hover:-translate-y-1" onClick={() => alert(`Navigating to thread: ${thread.title}`)}>
        <img src={thread.authorAvatar} alt={thread.author} className="h-10 w-10 rounded-full mr-4" />
        <div className="flex-grow">
            <h3 className="font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">{thread.title}</h3>
            <p className="text-xs text-kadin-slate">
                <span className="font-semibold text-kadin-light-slate">{thread.author}</span> posted in <span className="font-semibold text-kadin-gold">{thread.category}</span>
            </p>
        </div>
        <div className="text-center w-20">
            <p className="font-bold text-kadin-white text-lg">{thread.replies}</p>
            <p className="text-xs text-kadin-slate">Replies</p>
        </div>
        <div className="text-right w-24">
            <p className="text-sm text-kadin-light-slate">{thread.lastActivity}</p>
        </div>
    </div>
);


const KADINersRooms: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const displayedThreads = mockThreads.filter(thread => {
        if (!debouncedQuery) return true;
        const searchableText = `${thread.title} ${thread.category} ${thread.author}`;
        return fuzzySearch(debouncedQuery, searchableText);
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-kadin-white">KADINers Rooms</h2>
                <button className="bg-kadin-gold text-kadin-navy font-bold py-2 px-5 rounded-lg hover:bg-yellow-400 transition-colors">
                    Start New Discussion
                </button>
            </div>

            <div className="bg-kadin-light-navy/50 p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <input 
                    type="text" 
                    placeholder="Search discussions by title, category, or author..." 
                    className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto">
                    <option>All Categories</option>
                    <option>Investment & Policy</option>
                    <option>Energy & Resources</option>
                    <option>Marketing</option>
                    <option>Manufacturing</option>
                </select>
            </div>

            <div className="space-y-4">
                {displayedThreads.length > 0 ? (
                    displayedThreads.map(thread => (
                        <ThreadItem key={thread.id} thread={thread} />
                    ))
                ) : (
                     <div className="text-center py-10 text-kadin-slate">
                        <p>No discussion threads found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KADINersRooms;