import React from 'react';
import { ProjectOpportunity, Page } from '../types';

interface ProjectDetailProps {
    project: ProjectOpportunity;
    setCurrentPage: (page: Page) => void;
}

const sourceColors: { [key in ProjectOpportunity['source']]: string } = {
    'Government': 'bg-blue-500/10 text-blue-400',
    'World Bank': 'bg-green-500/10 text-green-400',
    'Private Sector': 'bg-purple-500/10 text-purple-400',
    'KADIN Initiative': 'bg-kadin-gold/10 text-kadin-gold',
    'Asian Development Bank': 'bg-cyan-500/10 text-cyan-400',
};

const statusColors: { [key in ProjectOpportunity['status']]: string } = {
    'Open for Bidding': 'bg-green-500/10 text-green-400',
    'In Progress': 'bg-yellow-500/10 text-yellow-400',
    'Closed': 'bg-red-500/10 text-red-400',
};

// --- Icons for this page ---
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
// --- End Icons ---


const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, setCurrentPage }) => {
    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={() => setCurrentPage('Project Opportunities')} className="text-sm text-kadin-gold hover:underline mb-4 inline-flex items-center">
                &larr; Back to All Opportunities
            </button>

            {/* Header */}
            <div className="bg-kadin-light-navy p-8 rounded-lg border border-gray-700 mb-8">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                     <span className={`text-sm font-bold px-3 py-1 rounded-full ${sourceColors[project.source]}`}>
                        {project.source}
                    </span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${statusColors[project.status]}`}>
                        {project.status}
                    </span>
                </div>
                <h2 className="text-4xl font-extrabold text-kadin-white">{project.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 bg-kadin-light-navy p-8 rounded-lg border border-gray-700 space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold text-kadin-white border-b border-gray-700 pb-3 mb-4">Project Scope</h3>
                        <p className="text-kadin-light-slate whitespace-pre-wrap">{project.description}</p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-kadin-white border-b border-gray-700 pb-3 mb-4">Relevant Sectors</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.sectors.map(sector => (
                                <span key={sector} className="text-sm bg-gray-700 text-kadin-light-slate px-3 py-1 rounded-full">{sector}</span>
                            ))}
                        </div>
                    </div>
                    
                    {project.requirements.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold text-kadin-white border-b border-gray-700 pb-3 mb-4">Specific Requirements</h3>
                            <ul className="space-y-3">
                                {project.requirements.map((req, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-kadin-light-slate">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.eligibility.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold text-kadin-white border-b border-gray-700 pb-3 mb-4">Eligibility Criteria</h3>
                            <ul className="space-y-3">
                                {project.eligibility.map((crit, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-kadin-light-slate">{crit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
                        <h4 className="text-lg font-bold text-kadin-white mb-4">Key Information</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-kadin-slate font-semibold">PROJECT VALUE</p>
                                <p className="font-bold text-kadin-gold text-2xl">{project.value}</p>
                            </div>
                            <div>
                                <p className="text-sm text-kadin-slate font-semibold">APPLICATION DEADLINE</p>
                                <p className="font-bold text-kadin-white text-xl">{project.deadline}</p>
                            </div>
                        </div>
                    </div>

                     <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
                        <button 
                            disabled={project.status !== 'Open for Bidding'}
                            className="w-full bg-kadin-gold text-kadin-navy font-bold py-3 rounded-lg text-md hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {project.status === 'Open for Bidding' ? 'Express Interest & Apply' : `Status: ${project.status}`}
                        </button>
                        <p className="text-xs text-kadin-slate text-center mt-3">
                            Clicking will take you to the official procurement portal or contact person for this opportunity.
                        </p>
                    </div>

                    {project.contact && (
                        <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
                            <h4 className="text-lg font-bold text-kadin-white mb-4">Contact for Inquiries</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center">
                                    <UserIcon className="h-5 w-5 text-kadin-slate mr-3 flex-shrink-0" />
                                    <span className="text-kadin-white font-semibold">{project.contact.name}</span>
                                </div>
                                <div className="flex items-center">
                                    <MailIcon className="h-5 w-5 text-kadin-slate mr-3 flex-shrink-0" />
                                    <a href={`mailto:${project.contact.email}`} className="text-kadin-gold hover:underline truncate">{project.contact.email}</a>
                                </div>
                                <div className="flex items-center">
                                    <PhoneIcon className="h-5 w-5 text-kadin-slate mr-3 flex-shrink-0" />
                                    <a href={`tel:${project.contact.phone}`} className="text-kadin-gold hover:underline">{project.contact.phone}</a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;