import React, { useState } from 'react';
import { Page } from '../types';

interface UpgradePageProps {
    setCurrentPage: (page: Page) => void;
}

// --- Icons for Benefits Section ---
const AiMatchmakingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11.25l.6-1.2 1.2-.6-1.2-.6-.6-1.2-.6 1.2-1.2.6 1.2.6.6 1.2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 10.5l.6-1.2 1.2-.6-1.2-.6-.6-1.2-.6 1.2-1.2.6 1.2.6.6 1.2zM5.25 10.5l.6-1.2 1.2-.6-1.2-.6-.6-1.2-.6 1.2-1.2.6 1.2.6.6 1.2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const TicketIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
    </svg>
);
const AnalyticsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);
const MultiUserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.226A3 3 0 0113.126 12c1.657 0 3-1.343 3-3s-1.343-3-3-3S10.126 6.343 10.126 9m7.5 2.226A3 3 0 0013.126 15c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3M6.84 15.72a9.094 9.094 0 01-3.742-.479 3 3 0 014.682-2.72m-7.5-2.226A3 3 0 006.874 9c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3m0-2.226A3 3 0 016.874 6c1.657 0 3 1.343 3 3s-1.343 3-3 3"/>
    </svg>
);
const AccountManagerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632zM16.125 12a.375.375 0 100-.75.375.375 0 000 .75zM12 12a.375.375 0 100-.75.375.375 0 000 .75zM7.875 12a.375.375 0 100-.75.375.375 0 000 .75z" />
    </svg>
);
const CompanyProfileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9.75 16.125a1.125 1.125 0 102.25 0 1.125 1.125 0 00-2.25 0z" />
    </svg>
);


// --- End Icons ---


const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 12H6" />
    </svg>
);


const features = [
    { name: 'Access to Member Directory', basic: true, premium: true, corporate: true },
    { name: 'Participate in Forums', basic: true, premium: true, corporate: true },
    { name: 'Access to Knowledge Hub', basic: true, premium: true, corporate: true },
    { name: 'AI-Powered Business Matching', basic: false, premium: true, corporate: true },
    { name: 'Exclusive Event Invitations', basic: false, premium: true, corporate: true },
    { name: 'Advanced Platform Analytics', basic: false, premium: true, corporate: true },
    { name: 'Premium Profile Badge', basic: false, premium: true, corporate: true },
    { name: 'Multi-User Access', basic: false, premium: false, corporate: 'Up to 5 members' },
    { name: 'Dedicated Account Manager', basic: false, premium: false, corporate: true },
    { name: 'Branded Company Profile Page', basic: false, premium: false, corporate: true },
    { name: 'Priority Event Sponsorship', basic: false, premium: false, corporate: true },
];


const faqItems = [
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your Premium subscription at any time. Your membership will remain active until the end of the current billing cycle. We do not offer refunds for partial periods."
    },
    {
        question: "What payment methods are accepted?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), as well as bank transfers and popular e-wallets for your convenience."
    },
    {
        question: "What is the difference between Premium and Premium Corporate?",
        answer: "The Premium plan is designed for individual professionals and small businesses. The Premium Corporate plan offers additional features for larger organizations, including multi-user access for your team, a dedicated account manager, and enhanced branding opportunities on the platform."
    }
];

const UpgradePage: React.FC<UpgradePageProps> = ({ setCurrentPage }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<'Premium' | 'Premium Corporate'>('Premium Corporate');

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-kadin-white mb-3">Upgrade to <span className="text-kadin-gold">Premium</span></h2>
                <p className="text-lg text-kadin-slate max-w-3xl mx-auto">
                    Unlock the full potential of KADIN 360. Gain exclusive access to features designed to accelerate your business growth and expand your network.
                </p>
            </div>

            {/* Pricing Plans Section */}
             <div className="max-w-4xl mx-auto mb-16">
                <h3 className="text-2xl font-bold text-kadin-white text-center mb-8">Choose Your Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                        className={`p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer ${selectedPlan === 'Premium' ? 'border-kadin-gold bg-kadin-light-navy' : 'border-gray-700 bg-kadin-light-navy/50 hover:border-gray-600'}`}
                        onClick={() => setSelectedPlan('Premium')}
                    >
                        <h4 className="text-2xl font-bold text-kadin-white">Premium</h4>
                        <p className="text-kadin-slate text-sm mb-2">For individuals & small teams</p>
                        <p className="text-3xl font-extrabold text-kadin-white my-2">Rp 2.500.000 <span className="text-lg font-normal text-kadin-slate">/ year</span></p>
                         <button className={`w-full mt-4 font-bold py-2 rounded-lg text-sm transition-colors ${selectedPlan === 'Premium' ? 'bg-kadin-gold text-kadin-navy' : 'bg-gray-600 text-white'}`}>
                            {selectedPlan === 'Premium' ? 'Selected' : 'Choose Plan'}
                        </button>
                    </div>
                     <div 
                        className={`relative p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer ${selectedPlan === 'Premium Corporate' ? 'border-kadin-gold bg-kadin-light-navy' : 'border-gray-700 bg-kadin-light-navy/50 hover:border-gray-600'}`}
                        onClick={() => setSelectedPlan('Premium Corporate')}
                    >
                        <div className="absolute top-0 right-4 -mt-3">
                            <span className="bg-kadin-gold text-kadin-navy text-xs font-bold px-3 py-1 rounded-full uppercase">Best Value</span>
                        </div>
                        <h4 className="text-2xl font-bold text-kadin-white">Premium Corporate</h4>
                         <p className="text-kadin-slate text-sm mb-2">For established businesses & teams</p>
                        <p className="text-3xl font-extrabold text-kadin-white my-2">Rp 10.000.000 <span className="text-lg font-normal text-kadin-slate">/ year</span></p>
                        <button className={`w-full mt-4 font-bold py-2 rounded-lg text-sm transition-colors ${selectedPlan === 'Premium Corporate' ? 'bg-kadin-gold text-kadin-navy' : 'bg-gray-600 text-white'}`}>
                             {selectedPlan === 'Premium Corporate' ? 'Selected' : 'Choose Plan'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="mb-16">
                <h3 className="text-2xl font-bold text-kadin-white text-center mb-8">Compare Plan Features</h3>
                <div className="bg-kadin-light-navy rounded-lg border border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-4 text-left text-kadin-white font-bold">Features</th>
                                <th className="p-4 text-center text-kadin-white font-bold w-32">Basic</th>
                                <th className={`p-4 text-center font-bold w-32 rounded-t-lg transition-colors ${selectedPlan === 'Premium' ? 'bg-kadin-gold/10 text-kadin-gold' : 'text-kadin-white'}`}>Premium</th>
                                <th className={`p-4 text-center font-bold w-32 rounded-t-lg transition-colors ${selectedPlan === 'Premium Corporate' ? 'bg-kadin-gold/10 text-kadin-gold' : 'text-kadin-white'}`}>Premium Corporate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr key={index} className="border-b border-gray-700/50 hover:bg-kadin-navy/50">
                                    <td className="p-4 text-kadin-light-slate">{feature.name}</td>
                                    <td className="p-4 text-center">
                                        {feature.basic ? <CheckIcon className="h-5 w-5 mx-auto text-green-400" /> : <MinusIcon className="h-5 w-5 mx-auto text-gray-600" />}
                                    </td>
                                    <td className={`p-4 text-center transition-colors ${selectedPlan === 'Premium' ? 'bg-kadin-gold/5' : ''}`}>
                                        {feature.premium ? <CheckIcon className="h-5 w-5 mx-auto text-green-400" /> : <MinusIcon className="h-5 w-5 mx-auto text-gray-600" />}
                                    </td>
                                     <td className={`p-4 text-center transition-colors ${selectedPlan === 'Premium Corporate' ? 'bg-kadin-gold/5' : ''}`}>
                                        {typeof feature.corporate === 'string' ? (
                                            <span className="text-xs font-bold text-kadin-white">{feature.corporate}</span>
                                        ) : feature.corporate ? (
                                            <CheckIcon className="h-5 w-5 mx-auto text-kadin-gold" />
                                        ) : (
                                            <MinusIcon className="h-5 w-5 mx-auto text-gray-600" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Testimonial Section */}
            <div className="mt-16 text-center">
                <div className="bg-kadin-light-navy p-8 rounded-lg border border-gray-700 max-w-3xl mx-auto">
                    <img src="https://picsum.photos/id/1011/100/100" alt="Citra Lestari" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-kadin-gold/50"/>
                    <blockquote className="text-lg text-kadin-light-slate italic">
                        "Upgrading to Premium Corporate was a game-changer. The AI matchmaking connected my team with two key partners in the first month. It's an investment that paid for itself almost immediately."
                    </blockquote>
                    <cite className="block font-bold text-kadin-white mt-4 not-italic">
                        Citra Lestari
                        <span className="block text-sm font-normal text-kadin-slate">CEO, Agro Makmur Sejahtera</span>
                    </cite>
                </div>
            </div>
            
            {/* FAQ Section */}
            <div className="mt-16 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-kadin-white text-center mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <div key={index} className="bg-kadin-light-navy border border-gray-700 rounded-lg">
                            <button 
                                className="w-full flex justify-between items-center text-left p-4"
                                onClick={() => toggleFaq(index)}
                            >
                                <span className="font-semibold text-kadin-white">{item.question}</span>
                                <ChevronDownIcon className={`w-5 h-5 text-kadin-slate transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40' : 'max-h-0'}`}>
                                <p className="text-kadin-slate text-sm p-4 pt-0">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;
