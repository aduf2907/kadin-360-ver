import React, { useState, useEffect } from 'react';
import { KadinPartner } from '../types';

const mockPartners: KadinPartner[] = [
    {
        id: 1,
        name: 'Lexis Legal Services',
        category: 'Legal Services',
        logoUrl: 'https://picsum.photos/seed/partner1/100/100',
        description: 'Comprehensive legal solutions for corporate and commercial law, specializing in contract negotiation and intellectual property.',
        offer: '20% off on all incorporation services',
        about: 'Lexis Legal Services is a premier law firm dedicated to providing top-tier legal counsel to businesses navigating the complexities of the Indonesian market. With over 20 years of combined experience, our team excels in corporate law, M&A, intellectual property, and regulatory compliance, ensuring our clients\' ventures are legally sound and secure.',
        services: ['Corporate Law Advisory', 'Contract Drafting & Negotiation', 'Intellectual Property Protection', 'Mergers & Acquisitions', 'Regulatory Compliance'],
        targetIndustries: ['Technology', 'Manufacturing', 'Real Estate', 'Financial Services'],
        contact: {
            email: 'contact@lexislegal.id',
            phone: '+62 21 2345 6789',
            website: 'www.lexislegal.id'
        }
    },
    {
        id: 2,
        name: 'FinPro Consulting',
        category: 'Financial Consulting',
        logoUrl: 'https://picsum.photos/seed/partner2/100/100',
        description: 'Expert financial advisory for SMEs, including fundraising, valuation, and M&A strategies to drive business growth.',
        offer: 'Free initial business valuation',
        about: 'FinPro Consulting empowers small and medium enterprises with the financial expertise typically reserved for large corporations. We specialize in creating robust financial models, preparing companies for investment rounds, and providing strategic advice to maximize shareholder value and ensure long-term financial health.',
        services: ['Financial Modeling & Forecasting', 'Fundraising Strategy (Seed to Series B)', 'Business Valuation', 'Due Diligence Support'],
        targetIndustries: ['Startups', 'SMEs', 'E-commerce', 'Agribusiness'],
        contact: {
            email: 'hello@finproconsulting.com',
            phone: '+62 21 9876 5432',
            website: 'www.finproconsulting.com'
        }
    },
    {
        id: 3,
        name: 'DigitalLeap Marketing',
        category: 'Digital Marketing',
        logoUrl: 'https://picsum.photos/seed/partner3/100/100',
        description: 'Data-driven digital marketing campaigns, from SEO and SEM to social media management, tailored for the Indonesian market.',
        offer: '15% off first 3-month retainer',
        about: 'DigitalLeap is a full-service digital marketing agency that helps brands connect with their audiences in a meaningful way. We combine creative strategy with data analytics to deliver measurable results. Our team of certified experts is passionate about crafting campaigns that not only engage but also convert.',
        services: ['Search Engine Optimization (SEO)', 'Performance Marketing (SEM/PPC)', 'Social Media Management', 'Content Strategy', 'Digital Branding'],
        targetIndustries: ['Retail & FMCG', 'Hospitality', 'Education', 'Healthcare'],
        contact: {
            email: 'growth@digitalleap.agency',
            phone: '+62 31 1122 3344',
            website: 'www.digitalleap.agency'
        }
    },
    {
        id: 4,
        name: 'HR Solutions Inc.',
        category: 'Human Resources',
        logoUrl: 'https://picsum.photos/seed/partner4/100/100',
        description: 'End-to-end HR services including talent acquisition, payroll management, and corporate training programs.',
        offer: 'Free HR audit for your company',
        about: 'HR Solutions Inc. acts as a strategic partner to manage your most valuable asset: your people. We provide outsourced HR services that streamline your operations, ensure compliance, and foster a productive work environment. From recruitment to retirement, we handle the complexities of HR so you can focus on your core business.',
        services: ['Talent Acquisition & Headhunting', 'Payroll & Benefits Administration', 'HR Compliance & Auditing', 'Leadership Training Programs'],
        targetIndustries: ['All Industries', 'Corporate', 'Non-Profit'],
        contact: {
            email: 'support@hrsolutions.co.id',
            phone: '+62 22 5555 8888',
            website: 'www.hrsolutions.co.id'
        }
    },
];

const PartnerCard: React.FC<{ partner: KadinPartner, onCardClick: () => void }> = ({ partner, onCardClick }) => (
    <div className="bg-kadin-light-navy rounded-lg border border-gray-700 p-6 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-300 h-full cursor-pointer hover:border-kadin-gold/50 group" onClick={onCardClick}>
        <img src={partner.logoUrl} alt={`${partner.name} logo`} className="w-20 h-20 rounded-full mb-4 border-2 border-kadin-gold/50" />
        <h3 className="text-xl font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">{partner.name}</h3>
        <p className="text-sm text-kadin-gold font-semibold mt-1">{partner.category}</p>
        <p className="text-sm text-kadin-slate mt-3 flex-grow">{partner.description}</p>
        <div className="w-full mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-kadin-light-slate">Exclusive Offer for KADIN Members:</p>
            <p className="text-md font-bold text-kadin-gold mt-1">{partner.offer}</p>
        </div>
        <button className="mt-4 w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors">
            View Details
        </button>
    </div>
);

const PartnerDetailModal: React.FC<{ partner: KadinPartner; onClose: () => void }> = ({ partner, onClose }) => {
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
           window.removeEventListener('keydown', handleEsc);
           document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-kadin-light-navy rounded-lg border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start">
                         <div className="flex items-center">
                            <img src={partner.logoUrl} alt={`${partner.name} logo`} className="w-20 h-20 rounded-full border-2 border-kadin-gold/50 flex-shrink-0" />
                            <div className="ml-4">
                                <h2 className="text-2xl font-bold text-kadin-white">{partner.name}</h2>
                                <p className="text-md text-kadin-gold font-semibold">{partner.category}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-kadin-slate hover:text-kadin-white">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-6 border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-bold text-kadin-white mb-2">About</h3>
                        <p className="text-sm text-kadin-slate">{partner.about}</p>

                        <h3 className="text-lg font-bold text-kadin-white mt-6 mb-2">Key Services</h3>
                        <ul className="list-disc list-inside text-sm text-kadin-slate space-y-1">
                            {partner.services.map(service => <li key={service}>{service}</li>)}
                        </ul>

                        <h3 className="text-lg font-bold text-kadin-white mt-6 mb-2">Target Industries</h3>
                         <div className="flex flex-wrap gap-2">
                            {partner.targetIndustries.map(industry => (
                                <span key={industry} className="text-xs bg-gray-700 text-kadin-light-slate px-3 py-1 rounded-full">{industry}</span>
                            ))}
                        </div>

                        <h3 className="text-lg font-bold text-kadin-white mt-6 mb-2">Contact Information</h3>
                        <div className="text-sm text-kadin-slate space-y-2">
                            <p><strong>Email:</strong> <a href={`mailto:${partner.contact.email}`} className="text-kadin-gold hover:underline">{partner.contact.email}</a></p>
                            <p><strong>Phone:</strong> <a href={`tel:${partner.contact.phone}`} className="text-kadin-gold hover:underline">{partner.contact.phone}</a></p>
                            <p><strong>Website:</strong> <a href={`https://${partner.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-kadin-gold hover:underline">{partner.contact.website}</a></p>
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-0 bg-kadin-navy p-6 rounded-b-lg border-t border-gray-700">
                    <h3 className="text-lg font-bold text-kadin-white">Exclusive KADIN Offer</h3>
                    <p className="text-kadin-gold font-bold text-xl mt-1">{partner.offer}</p>
                </div>
            </div>
        </div>
    );
};

const Mitra: React.FC = () => {
    const [selectedPartner, setSelectedPartner] = useState<KadinPartner | null>(null);

    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-2">Mitra KADIN</h2>
            <p className="text-kadin-light-slate mb-8">
                Discover a curated directory of verified partners and service providers offering exclusive benefits to KADIN members.
            </p>

            <div className="bg-kadin-light-navy/50 p-4 rounded-lg border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <input type="text" placeholder="Search by partner name or service..." className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full"/>
                <select className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto">
                    <option>All Categories</option>
                    <option>Legal Services</option>
                    <option>Financial Consulting</option>
                    <option>Digital Marketing</option>
                    <option>Human Resources</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPartners.map(partner => (
                    <PartnerCard key={partner.id} partner={partner} onCardClick={() => setSelectedPartner(partner)} />
                ))}
            </div>

            {selectedPartner && <PartnerDetailModal partner={selectedPartner} onClose={() => setSelectedPartner(null)} />}
        </div>
    );
};

export default Mitra;