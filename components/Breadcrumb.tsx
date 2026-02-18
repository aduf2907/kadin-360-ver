import React from 'react';
import { Page } from '../types';
import HomeIcon from './icons/HomeIcon';

interface BreadcrumbProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentPage, setCurrentPage }) => {
    // Jangan tampilkan breadcrumb di halaman Beranda itu sendiri
    if (currentPage === 'Beranda') {
        return null;
    }

    return (
        <nav className="flex items-center text-sm text-kadin-slate mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                    <a
                        onClick={() => setCurrentPage('Beranda')}
                        className="inline-flex items-center font-medium hover:text-kadin-gold cursor-pointer transition-colors"
                    >
                        <HomeIcon className="w-4 h-4 mr-2" />
                        Home
                    </a>
                </li>
                <li>
                    <div className="flex items-center">
                        <svg className="w-3 h-3 text-kadin-slate mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        {/* Halaman saat ini ditampilkan sebagai teks, bukan tautan */}
                        <span className="font-semibold text-kadin-white">{currentPage}</span>
                    </div>
                </li>
            </ol>
        </nav>
    );
};

export default Breadcrumb;
