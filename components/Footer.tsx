import React from 'react';
import { Page } from '../types';

const LocationIcon = () => (
    <svg className="w-5 h-5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const EmailIcon = () => (
    <svg className="w-5 h-5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-5 h-5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);

// Social Media Icons
const LinkedInIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/>
    </svg>
);
const TwitterIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
    </svg>
);
const FacebookIcon = () => (
     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
    </svg>
);


interface FooterProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ currentPage, setCurrentPage }) => {
    const quickLinks: { label: string; page: Page }[] = [
        { label: 'Dashboard', page: 'Dashboard' },
        { label: 'Business Matching', page: 'Matching' },
        { label: 'Knowledge Hub', page: 'Knowledge' },
    ];

    return (
        <footer className="bg-kadin-light-navy text-kadin-slate border-t border-gray-700">
            <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* About KADIN 360 */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold text-kadin-white">
                            KADIN <span className="text-kadin-gold">360</span>
                        </h3>
                        <p className="mt-4 text-sm max-w-md">
                            The integrated digital platform for Indonesian Chamber of Commerce and Industry members to connect, collaborate, and grow their businesses on a national and global scale.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-md font-semibold text-kadin-light-slate tracking-wider uppercase">Quick Links</h4>
                        <ul className="mt-4 space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.page}>
                                    <a
                                        onClick={() => setCurrentPage(link.page)}
                                        className={`text-sm cursor-pointer transition-colors duration-200 ${
                                            currentPage === link.page
                                                ? 'text-kadin-gold font-semibold'
                                                : 'hover:text-kadin-gold'
                                        }`}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h4 className="text-md font-semibold text-kadin-light-slate tracking-wider uppercase">Contact Us</h4>
                        <ul className="mt-4 space-y-5">
                            <li className="flex items-start">
                                <LocationIcon />
                                <span className="text-sm">Menara KADIN Indonesia, Jakarta, Indonesia</span>
                            </li>
                            <li className="flex items-start">
                                <EmailIcon />
                                <a href="mailto:info@kadin360.id" className="text-sm hover:text-kadin-gold transition-colors duration-200">info@kadin360.id</a>
                            </li>
                            <li className="flex items-start">
                                <PhoneIcon />
                                <a href="tel:+62211234567" className="text-sm hover:text-kadin-gold transition-colors duration-200">+62 21 1234 567</a>
                            </li>
                        </ul>
                         <div className="mt-8">
                             <h4 className="text-md font-semibold text-kadin-light-slate tracking-wider uppercase">Follow Us</h4>
                             <div className="flex space-x-5 mt-4">
                                <a href="#" className="text-kadin-slate hover:text-kadin-gold transition-colors duration-200"><LinkedInIcon/></a>
                                <a href="#" className="text-kadin-slate hover:text-kadin-gold transition-colors duration-200"><TwitterIcon/></a>
                                <a href="#" className="text-kadin-slate hover:text-kadin-gold transition-colors duration-200"><FacebookIcon/></a>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-kadin-navy py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto sm:flex sm:justify-between sm:items-center text-center">
                    <p className="text-xs">&copy; {new Date().getFullYear()} KADIN Indonesia. All Rights Reserved.</p>
                    <div className="mt-2 sm:mt-0 space-x-4">
                        <a href="#" className="text-xs hover:text-kadin-gold transition-colors duration-200">Privacy Policy</a>
                        <a href="#" className="text-xs hover:text-kadin-gold transition-colors duration-200">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;