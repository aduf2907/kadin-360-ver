import React from 'react';

// Inline Icons for this specific page
const GavelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.25 4.93l-1.25.42a1.5 1.5 0 01-1.8-1.8l.42-1.25a1.5 1.5 0 012.63.63zM5.38 18.23l.54.54a1.5 1.5 0 002.12 0l4.24-4.24a1.5 1.5 0 000-2.12l-.54-.54m-4.24 4.24l-1.84 1.84" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 13.5L3 21" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3l-6.5 6.5" />
    </svg>
);
const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
);
const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const BuildingOfficeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 12.75z" />
    </svg>
);
const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.334.644-.688.924-1.062a12.023 12.023 0 002.076-9.157c-.417-3.23-.97-6.22-1.996-8.83z" />
    </svg>
);
const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
    </svg>
);
const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.05 1.05 0 00-1.664 1.223l2.83 4.242-1.12 1.12a2.25 2.25 0 01-3.182 0l-6.364-6.364a2.25 2.25 0 010-3.182l2.83-2.83a2.25 2.25 0 013.182 0l4.242 2.83 1.12-1.12a2.25 2.25 0 013.182 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 10.625a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
    </svg>
);


const expertiseAreas = [
    { name: 'Corporate Law', icon: <GavelIcon className="h-10 w-10 text-kadin-gold" /> },
    { name: 'Intellectual Property', icon: <LightbulbIcon className="h-10 w-10 text-kadin-gold" /> },
    { name: 'Labor Law', icon: <UsersIcon className="h-10 w-10 text-kadin-gold" /> },
    { name: 'Contracts & Agreements', icon: <DocumentTextIcon className="h-10 w-10 text-kadin-gold" /> },
    { name: 'Real Estate Law', icon: <BuildingOfficeIcon className="h-10 w-10 text-kadin-gold" /> },
    { name: 'Regulatory Compliance', icon: <ShieldCheckIcon className="h-10 w-10 text-kadin-gold" /> },
];

const mockAdvisors = [
    { name: 'Anita Sari, S.H., M.H.', specialization: 'Corporate & M&A', avatar: 'https://picsum.photos/seed/lawyer1/100/100' },
    { name: 'Bambang Hartono, S.H.', specialization: 'Intellectual Property', avatar: 'https://picsum.photos/seed/lawyer2/100/100' },
    { name: 'Dewi Lestari, S.H., LL.M.', specialization: 'Labor & Employment', avatar: 'https://picsum.photos/seed/lawyer3/100/100' },
];

const HalloHukum: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center p-10 bg-kadin-light-navy rounded-lg border border-gray-700 mb-16 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 border-4 border-kadin-gold/10 rounded-full"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 border-4 border-kadin-gold/10 rounded-full"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold text-kadin-white mb-3">
                        Welcome to <span className="text-kadin-gold">HalloHukum</span>
                    </h2>
                    <p className="text-lg text-kadin-slate max-w-2xl mx-auto">
                        Your trusted legal partner. Get expert advice and consultation from verified legal professionals, exclusively for KADIN members.
                    </p>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="mb-16">
                <h3 className="text-2xl font-bold text-kadin-white text-center mb-8">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-transparent hover:border-kadin-gold/50 transition-all duration-300">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-kadin-navy mx-auto mb-4 border-2 border-kadin-gold">
                            <MagnifyingGlassIcon className="h-8 w-8 text-kadin-gold" />
                        </div>
                        <h4 className="text-xl font-bold text-kadin-white">1. Choose an Expert</h4>
                        <p className="text-kadin-slate text-sm mt-2">Browse our directory of verified legal advisors and find the right one for your specific needs.</p>
                    </div>
                    <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-transparent hover:border-kadin-gold/50 transition-all duration-300">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-kadin-navy mx-auto mb-4 border-2 border-kadin-gold">
                            <CalendarDaysIcon className="h-8 w-8 text-kadin-gold" />
                        </div>
                        <h4 className="text-xl font-bold text-kadin-white">2. Schedule a Consultation</h4>
                        <p className="text-kadin-slate text-sm mt-2">Book a confidential consultation session at a time that is convenient for you through our secure platform.</p>
                    </div>
                    <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-transparent hover:border-kadin-gold/50 transition-all duration-300">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-kadin-navy mx-auto mb-4 border-2 border-kadin-gold">
                            <ChatBubbleLeftRightIcon className="h-8 w-8 text-kadin-gold" />
                        </div>
                        <h4 className="text-xl font-bold text-kadin-white">3. Get Expert Advice</h4>
                        <p className="text-kadin-slate text-sm mt-2">Receive professional legal guidance to help you navigate your business challenges with confidence.</p>
                    </div>
                </div>
            </div>
            
            {/* Areas of Expertise Section */}
            <div className="mb-16">
                 <h3 className="text-2xl font-bold text-kadin-white text-center mb-8">Our Areas of Expertise</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {expertiseAreas.map(area => (
                        <div key={area.name} className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 text-center flex flex-col items-center justify-center">
                            {area.icon}
                            <p className="text-sm font-semibold text-kadin-light-slate mt-3">{area.name}</p>
                        </div>
                    ))}
                 </div>
            </div>

            {/* Meet Our Advisors Section */}
            <div className="mb-16">
                <h3 className="text-2xl font-bold text-kadin-white text-center mb-8">Meet Our Legal Advisors</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mockAdvisors.map(advisor => (
                        <div key={advisor.name} className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700 text-center transform hover:-translate-y-1 transition-transform duration-300">
                            <img src={advisor.avatar} alt={advisor.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-600" />
                            <h4 className="text-lg font-bold text-kadin-white">{advisor.name}</h4>
                            <p className="text-sm text-kadin-gold font-semibold">{advisor.specialization}</p>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-6">
                    <button className="text-kadin-gold font-semibold hover:underline">
                        View All Advisors &rarr;
                    </button>
                </div>
            </div>

            {/* Final CTA */}
            <div className="text-center p-8 bg-kadin-gold/10 rounded-lg border border-kadin-gold/20">
                 <h3 className="text-2xl font-bold text-kadin-white">Ready to Secure Your Business?</h3>
                 <p className="text-kadin-slate mt-2 mb-6">Take the next step in protecting and growing your business with professional legal support.</p>
                 <button className="bg-kadin-gold text-kadin-navy font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors text-lg">
                    Schedule a Consultation
                </button>
            </div>
        </div>
    );
};

export default HalloHukum;