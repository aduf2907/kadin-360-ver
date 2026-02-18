import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Page } from '../types';
import VerifiedIcon from './icons/VerifiedIcon';

// FIX: Added bonafidityStatus and rating to mock users to match UserProfile type.
const mockUsers: UserProfile[] = [
    { id: 1, name: 'Citra Lestari', company: 'Agro Makmur Sejahtera', role: 'CEO', avatar: 'https://picsum.photos/id/1011/200/200', industry: 'Agriculture', region: 'Surabaya', interests: ['export', 'sustainability', 'agritech', 'food security'], isAiRecommended: true, level: 'Premium', membershipId: 'KDN-87654321', validThru: '11/26', bio: 'Passionate agricultural entrepreneur focused on sustainable farming and international exports.', bonafidityStatus: 'Green', rating: 95, reviews: [
        { id: 1, reviewerId: 100, reviewerName: 'Budi Santoso', reviewerAvatar: 'https://picsum.photos/100', rating: 5, comment: 'Citra is an expert in her field. Her insights on sustainable agriculture were invaluable to our project.', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 2, reviewerId: 3, reviewerName: 'Rina Hartono', reviewerAvatar: 'https://picsum.photos/id/1012/40/40', rating: 4, comment: 'A pleasure to work with. Very professional and knowledgeable about the export market.', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
    ]},
    { id: 2, name: 'Andi Wijaya', company: 'PT. Maju Logistik', role: 'Operations Manager', avatar: 'https://picsum.photos/id/1027/200/200', industry: 'Technology', region: 'Jakarta', interests: ['supply chain', 'iot', 'logistics tech', 'e-commerce fulfillment'], isAiRecommended: true, level: 'Verified', membershipId: 'KDN-87654322', validThru: '10/25', bio: 'Logistics expert with a knack for integrating IoT and technology to streamline supply chains.', bonafidityStatus: 'Green', rating: 88, reviews: [] },
    { id: 3, name: 'Rina Hartono', company: 'Karya Manufaktur', role: 'Director', avatar: 'https://picsum.photos/id/1012/200/200', industry: 'Manufacturing', region: 'Bandung', interests: ['automation', 'quality control', 'lean manufacturing', 'industrial iot'], isAiRecommended: false, level: 'Active', membershipId: 'KDN-87654323', validThru: '09/26', bio: 'Dedicated manufacturing director with a focus on automation and quality excellence.', bonafidityStatus: 'Yellow', rating: 72, reviews: [] },
    { id: 4, name: 'David Lee', company: 'Innovate Solutions', role: 'CTO', avatar: 'https://picsum.photos/id/1013/200/200', industry: 'Technology', region: 'International', interests: ['saas', 'ai', 'cloud computing', 'machine learning'], isAiRecommended: true, level: 'Premium', membershipId: 'KDN-87654324', validThru: '08/25', bio: 'Technology leader specializing in SaaS platforms and AI-driven solutions for a global market.', bonafidityStatus: 'Green', rating: 98, reviews: [] },
    { id: 5, name: 'Siti Aminah', company: 'Green Energy Corp', role: 'Founder', avatar: 'https://picsum.photos/id/1014/200/200', industry: 'Energy', region: 'Jakarta', interests: ['renewable energy', 'investment', 'cleantech', 'carbon credits'], isAiRecommended: false, level: 'Verified', membershipId: 'KDN-87654325', validThru: '07/26', bio: 'Founder committed to advancing renewable energy solutions and seeking investment for sustainable projects.', bonafidityStatus: 'Green', rating: 90, reviews: [] },
    { id: 6, name: 'Bambang Susilo', company: 'Nusantara Foods', role: 'Marketing Head', avatar: 'https://picsum.photos/id/1015/200/200', industry: 'F&B', region: 'Surabaya', interests: ['branding', 'digital marketing', 'consumer goods', 'e-commerce'], isAiRecommended: false, level: 'Active', membershipId: 'KDN-87654326', validThru: '06/25', bio: 'Creative marketing head with a passion for building food and beverage brands in the digital era.', bonafidityStatus: 'Yellow', rating: 68, reviews: [] },
    { id: 100, name: 'Budi Santoso', company: 'PT. Digital Maju Bersama', role: 'Founder & CEO', avatar: 'https://picsum.photos/100', industry: 'Technology', region: 'Jakarta', interests: ['AI', 'Fintech', 'SaaS', 'E-commerce'], isAiRecommended: false, level: 'Active', membershipId: 'KDN-12345678', validThru: '12/25', bio: 'Visionary entrepreneur with over 15 years of experience in the technology sector. Passionate about leveraging AI and digital solutions to solve real-world problems. Actively seeking collaboration in fintech and sustainable tech.', bonafidityStatus: 'Green', rating: 92, reviews: [
        { id: 3, reviewerId: 2, reviewerName: 'Andi Wijaya', reviewerAvatar: 'https://picsum.photos/id/1027/40/40', rating: 5, comment: 'Budi is a true visionary. Our collaboration on the logistics platform was seamless and highly productive. Highly recommended.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ]}
];

/**
 * Calculates the Levenshtein distance between two strings.
 * This is a measure of the difference between two sequences.
 * @param s1 The first string.
 * @param s2 The second string.
 * @returns The Levenshtein distance.
 */
const levenshteinDistance = (s1: string, s2: string): number => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
};

/**
 * Performs a fuzzy search to check if a query matches a text.
 * It splits the query into tokens and checks if each token has a fuzzy match in the text.
 * @param query The search string.
 * @param text The text to search within.
 * @returns True if it's a match, false otherwise.
 */
const fuzzySearch = (query: string, text: string): boolean => {
    const queryTokens = query.toLowerCase().split(' ').filter(t => t);
    if (queryTokens.length === 0) return true;

    const textTokens = text.toLowerCase().split(/[\s,.\-_]+/);

    return queryTokens.every(qToken => {
        return textTokens.some(tToken => {
            // Allow more distance for longer words to be more forgiving.
            // e.g., length 1-4: 0 typos, 5-8: 1 typo, 9+: 2 typos
            const allowedDistance = Math.floor((qToken.length - 1) / 4);
            // Also check for prefix matching for "search-as-you-type" feel
            return tToken.startsWith(qToken) || levenshteinDistance(qToken, tToken) <= allowedDistance;
        });
    });
};

interface UserCardProps {
    user: UserProfile;
    onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => (
    <div 
        className="bg-kadin-light-navy p-5 rounded-lg border border-gray-700 text-center relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer hover:border-kadin-gold/50 group"
        onClick={onClick}
    >
        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-600"/>
        <h3 className="text-lg font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">{user.name}</h3>
        <p className="text-sm text-kadin-light-slate">{user.role} at {user.company}</p>
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{user.industry}</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{user.region}</span>
        </div>
        <div 
            className="mt-4 w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg group-hover:bg-yellow-400 transition-colors"
        >
            View Profile
        </div>
    </div>
);

interface MemberDirectoryProps {
    setCurrentPage: (page: Page, payload?: any) => void;
}

const MemberDirectory: React.FC<MemberDirectoryProps> = ({ setCurrentPage }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
    const [selectedRegion, setSelectedRegion] = useState('All Regions');
    const [selectedLevel, setSelectedLevel] = useState('All Levels');
    const [filteredMembers, setFilteredMembers] = useState<UserProfile[]>(mockUsers);
    const debounceTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = window.setTimeout(() => {
            const filtered = mockUsers.filter(user => {
                const searchableText = [
                    user.name,
                    user.company,
                    user.role,
                    user.industry,
                    user.region,
                    user.bio || '',
                    ...user.interests
                ].join(' ');

                const matchesQuery = fuzzySearch(searchQuery, searchableText);
                const matchesIndustry = selectedIndustry === 'All Industries' || user.industry === selectedIndustry;
                const matchesRegion = selectedRegion === 'All Regions' || user.region === selectedRegion;
                const matchesLevel = selectedLevel === 'All Levels' || user.level === selectedLevel;
                
                return matchesQuery && matchesIndustry && matchesRegion && matchesLevel;
            });
            
            setFilteredMembers(filtered);
        }, 300);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [searchQuery, selectedIndustry, selectedRegion, selectedLevel]);


    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-6">Member Directory</h2>
            <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center flex-wrap">
                <input 
                    type="text" 
                    placeholder="Search by name, company, industry, or interest..." 
                    className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select 
                    className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                >
                    <option>All Industries</option>
                    <option>Technology</option>
                    <option>Agriculture</option>
                    <option>Manufacturing</option>
                    <option>Energy</option>
                    <option>F&B</option>
                </select>
                <select 
                    className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                >
                    <option>All Regions</option>
                    <option>Jakarta</option>
                    <option>Surabaya</option>
                    <option>Bandung</option>
                    <option>International</option>
                </select>
                <select 
                    className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                >
                    <option>All Levels</option>
                    <option>Premium</option>
                    <option>Verified</option>
                    <option>Active</option>
                </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map(user => <UserCard key={user.id} user={user} onClick={() => setCurrentPage('Profile', user)} />)
                ) : (
                    <div className="col-span-full text-center py-10 text-kadin-slate">
                        <p>No members found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberDirectory;