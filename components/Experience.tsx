import React from 'react';
import { ExperiencePost } from '../types';

const mockExperiences: ExperiencePost[] = [
    {
        id: 1,
        title: 'Insights from the ASEAN Business Summit 2024',
        category: 'Conference',
        author: 'Rina Hartono',
        authorAvatar: 'https://picsum.photos/id/1012/40/40',
        imageUrl: 'https://picsum.photos/seed/experience1/400/250',
        summary: 'A deep dive into the key takeaways on regional economic integration and digital transformation discussed at the summit.',
        date: 'Oct 15, 2024'
    },
    {
        id: 2,
        title: 'Showcasing Indonesian Innovation at Hannover Messe',
        category: 'Exhibition',
        author: 'Budi Santoso',
        authorAvatar: 'https://picsum.photos/100',
        imageUrl: 'https://picsum.photos/seed/experience2/400/250',
        summary: 'Our journey representing Indonesian manufacturing and technology on the global stage. Lessons learned and partnerships formed.',
        date: 'Sep 28, 2024'
    },
    {
        id: 3,
        title: 'Strategic Business Trip to South Korea: Exploring Tech Partnerships',
        category: 'Business Trip',
        author: 'Andi Wijaya',
        authorAvatar: 'https://picsum.photos/id/1027/40/40',
        imageUrl: 'https://picsum.photos/seed/experience3/400/250',
        summary: 'A successful trip resulting in three MoUs with leading Korean technology firms. A look into the process and outcomes.',
        date: 'Sep 10, 2024'
    },
    {
        id: 4,
        title: 'Digital Marketing Masterclass for Exporters',
        category: 'Workshop',
        author: 'Citra Lestari',
        authorAvatar: 'https://picsum.photos/id/1011/40/40',
        imageUrl: 'https://picsum.photos/seed/experience4/400/250',
        summary: 'Highlights from the intensive workshop covering SEO, content marketing, and social media strategies for international markets.',
        date: 'Aug 22, 2024'
    }
];

const ExperienceCard: React.FC<{ post: ExperiencePost }> = ({ post }) => (
    <div className="bg-kadin-light-navy rounded-lg overflow-hidden border border-gray-700 transform hover:-translate-y-1 transition-transform duration-300 flex flex-col cursor-pointer hover:border-kadin-gold/50 group" onClick={() => alert(`Navigating to details for "${post.title}"`)}>
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover"/>
        <div className="p-4 flex flex-col flex-grow">
            <span className="text-xs font-semibold text-kadin-gold bg-kadin-gold/10 px-2 py-1 rounded-full self-start">{post.category}</span>
            <h3 className="text-lg font-bold mt-2 text-kadin-white flex-grow transition-colors duration-200 group-hover:text-kadin-gold">{post.title}</h3>
            <p className="text-sm mt-2 text-kadin-slate">{post.summary}</p>
            <div className="flex items-center mt-4 pt-4 border-t border-gray-700">
                <img src={post.authorAvatar} alt={post.author} className="h-8 w-8 rounded-full mr-3"/>
                <div>
                    <p className="text-sm font-semibold text-kadin-light-slate">{post.author}</p>
                    <p className="text-xs text-kadin-slate">{post.date}</p>
                </div>
            </div>
        </div>
    </div>
);

const Experience: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-6">Experience Hub</h2>
            
            <div className="bg-kadin-light-navy/50 p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <input type="text" placeholder="Search experiences..." className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full"/>
                <select className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto">
                    <option>All Categories</option>
                    <option>Conference</option>
                    <option>Exhibition</option>
                    <option>Business Trip</option>
                    <option>Workshop</option>
                </select>
                <button className="w-full md:w-auto bg-kadin-gold text-kadin-navy font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors">Search</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockExperiences.map(post => (
                    <ExperienceCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Experience;