import React, { useState } from 'react';
import { Document } from '../types';

// Icons for the page
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);


const mockDocuments: Document[] = [
    { id: 1, name: 'Surat Edaran Rapat Umum Anggota Tahunan 2024', category: 'Circular', uploadedDate: '2024-10-15', fileSize: '1.2 MB' },
    { id: 2, name: 'SK Pengangkatan Dewan Penasihat Periode 2024-2029', category: 'Official Letter', uploadedDate: '2024-10-12', fileSize: '850 KB' },
    { id: 3, name: 'Laporan Kinerja Triwulan 3 - 2024', category: 'Report', uploadedDate: '2024-10-10', fileSize: '5.4 MB' },
    { id: 4, name: 'Panduan Pendaftaran Program Business Matching', category: 'Guideline', uploadedDate: '2024-10-05', fileSize: '2.1 MB' },
    { id: 5, name: 'Undangan Rapat Komite Perdagangan Internasional', category: 'Official Letter', uploadedDate: '2024-10-02', fileSize: '500 KB' },
];

const categoryColors: { [key in Document['category']]: string } = {
    'Circular': 'bg-blue-500/10 text-blue-400',
    'Official Letter': 'bg-yellow-500/10 text-yellow-400',
    'Report': 'bg-green-500/10 text-green-400',
    'Guideline': 'bg-purple-500/10 text-purple-400',
};

const DocumentHub: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const filteredDocuments = mockDocuments.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-2">Document Hub</h2>
            <p className="text-kadin-light-slate mb-8">
                Search, view, and download all important KADIN Secretariat documents from one secure location.
            </p>

            <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center flex-wrap">
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:flex-1"
                />
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
                >
                    <option value="All">All Categories</option>
                    <option value="Circular">Circulars</option>
                    <option value="Official Letter">Official Letters</option>
                    <option value="Report">Reports</option>
                    <option value="Guideline">Guidelines</option>
                </select>
                <button className="w-full md:w-auto bg-kadin-gold text-kadin-navy font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors inline-flex items-center justify-center">
                    <UploadIcon className="h-5 w-5 mr-2" />
                    Upload Document
                </button>
            </div>

            <div className="bg-kadin-light-navy rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-kadin-slate">
                        <thead className="text-xs text-kadin-light-slate uppercase bg-kadin-navy">
                            <tr>
                                <th scope="col" className="px-6 py-3">Document Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Date Uploaded</th>
                                <th scope="col" className="px-6 py-3">File Size</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocuments.map((doc) => (
                                <tr key={doc.id} className="border-b border-gray-700 hover:bg-kadin-navy/50">
                                    <td className="px-6 py-4 font-medium text-kadin-white whitespace-nowrap flex items-center">
                                        <FileIcon className="h-5 w-5 mr-3 text-kadin-slate" />
                                        {doc.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[doc.category]}`}>
                                            {doc.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{doc.uploadedDate}</td>
                                    <td className="px-6 py-4">{doc.fileSize}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button className="p-2 text-kadin-slate hover:text-kadin-gold transition-colors" title="View">
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                            <button className="p-2 text-kadin-slate hover:text-kadin-gold transition-colors" title="Download">
                                                <DownloadIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredDocuments.length === 0 && (
                     <div className="text-center py-10 text-kadin-slate">
                        <p>No documents found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentHub;