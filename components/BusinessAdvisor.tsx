import React from 'react';

// --- Inline SVG Icons for this page ---

// Icon for Strategic Planning
const CompassIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.657-4.657l-1.414-1.414M6.757 17.243l-1.414-1.414m0-9.172l1.414 1.414M17.243 17.243l1.414 1.414" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15l-3-6 6 3-3-3z" />
    </svg>
);

// Icon for Financial Advisory
const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

// Icon for Market Expansion
const GlobeAltIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.75 9h16.5M3.75 15h16.5M9.75 3.75c.493 2.12.83 4.417.994 6.75m2.512 0c.164-2.333.493-4.63.994-6.75M12 21v-3.375" />
    </svg>
);

// Icon for Digital Transformation
const CpuChipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75zM3.75 4.5v.75A.75.75 0 013 6v12a.75.75 0 01.75.75v.75m16.5 0v-.75a.75.75 0 00-.75-.75V6a.75.75 0 00-.75-.75v-.75" />
    </svg>
);

const mockAdvisors = [
    {
        name: 'Dr. Ir. Hendra Gunawan, MBA',
        specialization: 'Strategic Management & Corporate Finance',
        avatar: 'https://picsum.photos/seed/advisor1/200/200',
        bio: 'With 25+ years of C-level experience in multinational corporations, Dr. Hendra provides invaluable insights on scaling operations and navigating complex financial landscapes.'
    },
    {
        name: 'Sofia Lestari, S.E., M.M.',
        specialization: 'Digital Marketing & Go-to-Market Strategy',
        avatar: 'https://picsum.photos/seed/advisor2/200/200',
        bio: 'A digital native with a proven track record of launching successful brands in the Indonesian market. Sofia helps businesses harness the power of digital to achieve explosive growth.'
    },
    {
        name: 'Baskoro Adiwijaya, S.T.',
        specialization: 'Technology & Operational Efficiency',
        avatar: 'https://picsum.photos/seed/advisor3/200/200',
        bio: 'An expert in industrial automation and supply chain optimization. Baskoro advises manufacturing and logistics companies on leveraging technology for a competitive edge.'
    }
];

const BusinessAdvisor: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="relative bg-kadin-light-navy p-12 rounded-lg border border-gray-700 text-center overflow-hidden mb-16">
                 <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://picsum.photos/seed/strategy/1200/400')"}}></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-kadin-light-navy via-kadin-light-navy/80 to-kadin-light-navy/50"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold text-kadin-white mb-3">
                        KADIN Business Advisor
                    </h2>
                    <p className="text-xl text-kadin-gold font-semibold mb-4">
                        Expert Guidance for Your Business Growth
                    </p>
                    <p className="text-lg text-kadin-slate max-w-3xl mx-auto">
                        Connect with a curated network of seasoned industry veterans and functional experts to navigate your most pressing business challenges and unlock new opportunities.
                    </p>
                    <button className="mt-8 bg-kadin-gold text-kadin-navy font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors text-lg">
                        Book Your First Consultation
                    </button>
                </div>
            </div>

            {/* Service Pillars Section */}
            <div className="mb-16">
                <h3 className="text-2xl font-bold text-kadin-white text-center mb-8">How We Can Help</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-gray-700/50 text-center">
                        <CompassIcon className="h-12 w-12 text-kadin-gold mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-kadin-white">Strategic Planning</h4>
                        <p className="text-kadin-slate text-sm mt-2">Develop robust, long-term strategies for sustainable growth, market positioning, and competitive advantage.</p>
                    </div>
                    <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-gray-700/50 text-center">
                        <ChartBarIcon className="h-12 w-12 text-kadin-gold mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-kadin-white">Financial Advisory</h4>
                        <p className="text-kadin-slate text-sm mt-2">Optimize your financial health with expert advice on fundraising, capital allocation, and profitability analysis.</p>
                    </div>
                    <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-gray-700/50 text-center">
                        <GlobeAltIcon className="h-12 w-12 text-kadin-gold mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-kadin-white">Market Expansion</h4>
                        <p className="text-kadin-slate text-sm mt-2">Navigate the complexities of entering new domestic or international markets, from research to execution.</p>
                    </div>
                    <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-gray-700/50 text-center">
                        <CpuChipIcon className="h-12 w-12 text-kadin-gold mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-kadin-white">Digital Transformation</h4>
                        <p className="text-kadin-slate text-sm mt-2">Leverage technology to streamline operations, enhance customer experience, and build a future-proof business.</p>
                    </div>
                </div>
            </div>

            {/* Meet the Advisors Section */}
            <div className="mb-16">
                <h3 className="text-2xl font-bold text-kadin-white text-center mb-8">Meet Our Esteemed Advisors</h3>
                <div className="space-y-8">
                    {mockAdvisors.map(advisor => (
                        <div key={advisor.name} className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700 flex flex-col md:flex-row items-center gap-6 transform hover:-translate-y-1 transition-transform duration-300">
                            <img src={advisor.avatar} alt={advisor.name} className="w-32 h-32 rounded-full flex-shrink-0 border-4 border-kadin-gold/50" />
                            <div className="text-center md:text-left">
                                <h4 className="text-xl font-bold text-kadin-white">{advisor.name}</h4>
                                <p className="text-md text-kadin-gold font-semibold">{advisor.specialization}</p>
                                <p className="text-sm text-kadin-slate mt-2">{advisor.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-8">
                    <button className="text-kadin-gold font-semibold hover:underline">
                        View All Advisors &rarr;
                    </button>
                </div>
            </div>
            
            {/* Final CTA */}
             <div className="text-center p-8 bg-kadin-gold/10 rounded-lg border border-kadin-gold/20">
                 <h3 className="text-2xl font-bold text-kadin-white">Ready to Elevate Your Business?</h3>
                 <p className="text-kadin-slate mt-2 mb-6 max-w-2xl mx-auto">Take the decisive step towards strategic clarity and accelerated growth. Our advisors are ready to partner with you on your journey to success.</p>
                 <button className="bg-kadin-gold text-kadin-navy font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors text-lg">
                    Schedule Your Consultation Now
                </button>
            </div>
        </div>
    );
};

export default BusinessAdvisor;
