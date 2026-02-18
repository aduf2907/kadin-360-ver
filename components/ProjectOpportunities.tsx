
import React, { useState, useEffect, useRef } from 'react';
import { ProjectOpportunity, Page } from '../types';

const mockProjects: ProjectOpportunity[] = [
    {
        id: 1,
        title: 'Development of a National Digital Identity System',
        source: 'Government',
        sectors: ['Technology', 'Public Sector'],
        description: 'A national-scale project to build and implement a secure digital identity framework for all Indonesian citizens, enhancing public service delivery and financial inclusion.',
        value: 'IDR 1.2 Trillion',
        status: 'Open for Bidding',
        deadline: 'Dec 31, 2024',
        requirements: [
            'Proven experience in large-scale identity management systems.',
            'Compliance with ISO 27001 and GDPR-like data protection standards.',
            'Demonstrable expertise in blockchain and cryptographic security.',
            'Ability to integrate with existing government databases (e.g., Dukcapil).',
        ],
        eligibility: [
            'Indonesian-registered legal entity (PT).',
            'Minimum 10 years of operation in the IT sector.',
            'Consortiums are welcome, with a clear lead partner.',
            'No ongoing legal disputes with government agencies.',
        ],
        contact: {
            name: 'Dr. Indah Permata',
            email: 'procurement.digitalid@kominfo.go.id',
            phone: '+62 21 1234 5678',
        },
    },
    {
        id: 6,
        title: 'Develop Smart City Infrastructure in IKN',
        source: 'Government',
        sectors: ['Infrastructure', 'Technology', 'Smart City'],
        description: 'A key initiative by the Indonesian government to establish a foundational smart city ecosystem in the new capital region, focusing on connectivity, data management, and citizen services.',
        value: 'IDR 5 Trillion',
        status: 'Open for Bidding',
        deadline: 'Jun 30, 2025',
        requirements: [
            'Experience with large-scale smart city projects',
            'Expertise in IoT and 5G deployment',
            'Proven ability to integrate diverse data platforms',
            'Knowledge of urban planning regulations',
        ],
        eligibility: [
            'Consortiums with a lead Indonesian tech company',
            'Minimum 15 years of experience in infrastructure development',
            'Strong financial backing',
        ],
        contact: {
            name: 'Mr. Agus Setiawan',
            email: 'procurement.ikn@go.id',
            phone: '+62 21 5555 1234',
        },
    },
    {
        id: 2,
        title: 'Sustainable Agri-Fishery Supply Chain Enhancement',
        source: 'World Bank',
        sectors: ['Agriculture', 'Logistics', 'Sustainability'],
        description: 'A World Bank-funded initiative to modernize supply chains for agricultural and fishery products in Eastern Indonesia, focusing on cold storage and digital tracking.',
        value: '$50 Million',
        status: 'Open for Bidding',
        deadline: 'Jan 15, 2025',
        requirements: [
            'Expertise in cold chain logistics and IoT-based monitoring.',
            'Experience working in remote or underserved areas.',
            'Strong community engagement and local SME partnership plan.',
            'Compliance with World Bank environmental and social standards.',
        ],
        eligibility: [
            'Firms or joint ventures with experience in internationally funded projects.',
            'Demonstrated financial capacity to handle large-scale logistics.',
            'Must have a local office or partner in Eastern Indonesia.',
        ],
        contact: {
            name: 'Mr. David Chen',
            email: 'wb.agri.procurement@worldbank.org',
            phone: '+1 202 473 1000',
        },
    },
    {
        id: 5,
        title: 'ASEAN Electric Vehicle (EV) Charging Network Initiative',
        source: 'Asian Development Bank',
        sectors: ['Infrastructure', 'Energy', 'Technology', 'Sustainability'],
        description: 'A multi-country initiative funded by the ADB to develop a standardized and interconnected EV charging infrastructure network across key ASEAN transport corridors.',
        value: '$150 Million',
        status: 'Open for Bidding',
        deadline: 'Mar 31, 2025',
        requirements: [
            'Experience in deploying and managing EV charging hardware and software.',
            'Adherence to OCPP (Open Charge Point Protocol) standards.',
            'Ability to work with multiple national energy regulators.',
            'Proposal must include a sustainable business model for long-term operation.',
        ],
        eligibility: [
            'Consortiums with members from at least two ASEAN countries.',
            'Lead firm must have a minimum of 5 years experience in the EV sector.',
            'Proven track record of large-scale infrastructure projects.',
        ],
        contact: {
            name: 'Maria Kristina',
            email: 'asean.ev@adb.org',
            phone: '+63 2 8632 4444',
        },
    },
    {
        id: 3,
        title: 'Renewable Energy Grid Integration in West Java',
        source: 'Private Sector',
        sectors: ['Energy', 'Infrastructure'],
        description: 'A private-sector-led consortium is seeking partners for a large-scale solar and wind farm project, including grid integration and battery storage solutions.',
        value: '$250 Million',
        status: 'Closed',
        deadline: 'Feb 28, 2025',
        requirements: [
            'Specialization in High Voltage Direct Current (HVDC) transmission systems.',
            'Expertise in Battery Energy Storage Systems (BESS) of over 100MWh.',
            'Proven EPC (Engineering, Procurement, and Construction) capabilities for renewable projects.',
        ],
        eligibility: [
            'Firms with a portfolio of completed renewable energy projects exceeding 500MW.',
            'Strong financial standing and ability to secure performance bonds.',
            'Local content and manpower development plan is highly preferred.',
        ],
        contact: {
            name: 'PT Energi Terbarukan Nusantara',
            email: 'bids.westjava@etn-power.com',
            phone: '+62 22 987 6543',
        },
    },
    {
        id: 4,
        title: 'SME Digitalization Program',
        source: 'KADIN Initiative',
        sectors: ['SMEs', 'Technology', 'Education'],
        description: 'A KADIN-led initiative to provide digital tools, training, and e-commerce integration for 10,000 SMEs across Indonesia.',
        value: 'IDR 50 Billion',
        status: 'In Progress',
        deadline: 'N/A',
        requirements: [],
        eligibility: [],
        contact: {
            name: 'KADIN SME Committee',
            email: 'sme.program@kadin.id',
            phone: '+62 21 527 4484',
        },
    }
];

const sourceColors: { [key in ProjectOpportunity['source']]: string } = {
    'Government': 'bg-blue-500/10 text-blue-400',
    'World Bank': 'bg-green-500/10 text-green-400',
    'Private Sector': 'bg-purple-500/10 text-purple-400',
    'KADIN Initiative': 'bg-kadin-gold/10 text-kadin-gold',
    'Asian Development Bank': 'bg-cyan-500/10 text-cyan-400',
};

const statusColors: { [key in ProjectOpportunity['status']]: string } = {
    'Open for Bidding': 'bg-green-500 text-white',
    'In Progress': 'bg-yellow-500 text-kadin-navy',
    'Closed': 'bg-red-600 text-white',
};

const BookmarkIcon: React.FC<{ className?: string, isSaved: boolean }> = ({ className, isSaved }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);


const ProjectCard: React.FC<{ project: ProjectOpportunity; onDetailsClick: () => void; isSaved: boolean; onToggleSave: () => void; }> = ({ project, onDetailsClick, isSaved, onToggleSave }) => (
    <div 
        onClick={onDetailsClick}
        className="relative bg-kadin-light-navy rounded-lg border border-gray-700 p-6 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 hover:border-kadin-gold/50 group cursor-pointer"
    >
        <button
            onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
            }}
            className="absolute top-4 right-4 z-10 p-2 bg-kadin-navy/50 rounded-full text-kadin-slate hover:text-kadin-gold transition-colors"
            aria-label="Save project"
        >
            <BookmarkIcon isSaved={isSaved} className={`h-5 w-5 ${isSaved ? 'text-kadin-gold' : ''}`} />
        </button>
        <div className="flex justify-between items-start mb-3">
             <div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[project.status]}`}>
                    {project.status}
                </span>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${sourceColors[project.source]}`}>
                {project.source}
            </span>
        </div>
        <h3 className="text-xl font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold mb-2 flex-grow-0">{project.title}</h3>

        <div className="flex flex-wrap gap-2 items-center mb-3">
            {project.sectors.map(sector => (
                <span key={sector} className="text-xs bg-gray-700 text-kadin-light-slate px-2 py-1 rounded-full">{sector}</span>
            ))}
        </div>

        <p className="text-sm text-kadin-slate mb-4 flex-grow line-clamp-3">{project.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-center mt-auto pt-4 border-t border-gray-700">
            <div>
                <p className="text-xs text-kadin-slate font-semibold">PROJECT VALUE</p>
                <p className="font-bold text-kadin-white text-lg">{project.value}</p>
            </div>
            <div>
                <p className="text-xs text-kadin-slate font-semibold">DEADLINE</p>
                <p className="font-bold text-kadin-white text-lg">{project.deadline}</p>
            </div>
        </div>
        <div 
            className="w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg text-sm group-hover:bg-yellow-400 transition-colors mt-4 text-center"
        >
            View Details
        </div>
    </div>
);


interface ProjectOpportunitiesProps {
    setCurrentPage: (page: Page, payload?: any) => void;
}

const ProjectOpportunities: React.FC<ProjectOpportunitiesProps> = ({ setCurrentPage }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSource, setSelectedSource] = useState('All Sources');
    const [selectedSector, setSelectedSector] = useState('All Sectors');
    const [filteredProjects, setFilteredProjects] = useState<ProjectOpportunity[]>(mockProjects);
    const debounceTimeout = useRef<number | null>(null);
    const [savedProjectIds, setSavedProjectIds] = useState<Set<number>>(new Set());
    const [activeTab, setActiveTab] = useState<'All' | 'Saved'>('All');


    const allSectors = [...new Set(mockProjects.flatMap(p => p.sectors))];
    
    const handleToggleSave = (projectId: number) => {
        setSavedProjectIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(projectId)) {
                newSet.delete(projectId);
            } else {
                newSet.add(projectId);
            }
            return newSet;
        });
    };

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = window.setTimeout(() => {
            let baseProjects = mockProjects;

            if (activeTab === 'Saved') {
                baseProjects = mockProjects.filter(p => savedProjectIds.has(p.id));
            }

            const filtered = baseProjects.filter(project => {
                const matchesQuery = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || project.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesSource = selectedSource === 'All Sources' || project.source === selectedSource;
                const matchesSector = selectedSector === 'All Sectors' || project.sectors.includes(selectedSector);
                
                return matchesQuery && matchesSource && matchesSector;
            });
            
            setFilteredProjects(filtered);
        }, 300);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [searchQuery, selectedSource, selectedSector, activeTab, savedProjectIds]);


    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-2">Project Opportunities</h2>
            <p className="text-kadin-light-slate mb-8">
                Discover and engage with high-value projects from government, international funding agencies, and the private sector.
            </p>

            <div className="border-b border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('All')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'All' ? 'border-kadin-gold text-kadin-gold' : 'border-transparent text-kadin-slate hover:text-kadin-white'}`}>
                        All Projects
                    </button>
                    <button onClick={() => setActiveTab('Saved')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Saved' ? 'border-kadin-gold text-kadin-gold' : 'border-transparent text-kadin-slate hover:text-kadin-white'}`}>
                        Saved Projects ({savedProjectIds.size})
                    </button>
                </nav>
            </div>

             <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center flex-wrap">
                <input 
                    type="text" 
                    placeholder="Search by project title or keyword..." 
                    className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                 <select 
                    className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                >
                    <option>All Sources</option>
                    <option>Government</option>
                    <option>World Bank</option>
                    <option>Asian Development Bank</option>
                    <option>Private Sector</option>
                    <option>KADIN Initiative</option>
                </select>
                <select 
                    className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                >
                    <option>All Sectors</option>
                    {allSectors.map(sector => <option key={sector}>{sector}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onDetailsClick={() => setCurrentPage('Project Details', project)}
                            isSaved={savedProjectIds.has(project.id)}
                            onToggleSave={() => handleToggleSave(project.id)}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-kadin-slate">
                        <p>No project opportunities found matching your criteria.</p>
                        {activeTab === 'Saved' && <p className="text-sm mt-2">You haven't saved any projects yet. Click the bookmark icon on a project to save it.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectOpportunities;
