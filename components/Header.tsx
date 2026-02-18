
import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';

// Icons for the header
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

// Icons for Dropdown
const ProfileDropdownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const CardDropdownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);
const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


interface HeaderProps {
    toggleSidebar: () => void;
    setCurrentPage: (page: Page) => void;
    handleLogout: () => void;
}

const NOTIFICATION_PREFS_KEY = 'kadin360-notification-prefs';

const Header: React.FC<HeaderProps> = ({ toggleSidebar, setCurrentPage, handleLogout }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
    const [notificationPrefs, setNotificationPrefs] = useState(() => {
        try {
            const savedPrefs = localStorage.getItem(NOTIFICATION_PREFS_KEY);
            return savedPrefs ? JSON.parse(savedPrefs) : {
                messages: true,
                events: true,
                news: false,
            };
        } catch (error) {
            console.error("Could not parse notification preferences from localStorage", error);
            return {
                messages: true,
                events: true,
                news: false,
            };
        }
    });
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const notificationDropdownRef = useRef<HTMLDivElement>(null);

    // Save preferences to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(notificationPrefs));
        } catch (error) {
            console.error("Could not save notification preferences to localStorage", error);
        }
    }, [notificationPrefs]);
    

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
                setNotificationSettingsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificationChange = (pref: keyof typeof notificationPrefs) => {
        setNotificationPrefs(prev => ({...prev, [pref]: !prev[pref]}));
    };
    
     const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );

    return (
        <header className="flex-shrink-0 bg-kadin-light-navy/80 backdrop-blur-md border-b border-gray-700 h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="lg:hidden text-kadin-slate mr-4">
                    <MenuIcon className="h-6 w-6" />
                </button>
                {/* 
                   Area ini sebelumnya berisi NavMenu. 
                   Sekarang dikosongkan agar tampilan header lebih fokus pada tools dan profil, 
                   karena navigasi utama sudah ada di Sidebar.
                */}
            </div>

            <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative hidden md:block">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-kadin-slate" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-kadin-navy w-64 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-kadin-gold"
                    />
                </div>
                
                {/* Notification Icon & Dropdown */}
                <div className="relative" ref={notificationDropdownRef}>
                    <button onClick={() => setNotificationSettingsOpen(!notificationSettingsOpen)} className="text-kadin-slate hover:text-kadin-white p-2 rounded-full hover:bg-kadin-navy">
                        <BellIcon className="h-6 w-6" />
                    </button>
                    {notificationSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-72 origin-top-right bg-kadin-light-navy rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                            <div className="p-4 border-b border-gray-600">
                                <h4 className="font-bold text-kadin-white">Notifications</h4>
                                <p className="text-xs text-kadin-slate">Manage your notification preferences.</p>
                            </div>
                            <div className="py-2 px-4 space-y-3">
                                <label className="flex items-center justify-between text-sm">
                                    <span className="text-kadin-light-slate">New Messages</span>
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-kadin-gold bg-kadin-navy border-gray-600 rounded focus:ring-kadin-gold" checked={notificationPrefs.messages} onChange={() => handleNotificationChange('messages')} />
                                </label>
                                <label className="flex items-center justify-between text-sm">
                                    <span className="text-kadin-light-slate">Community Events</span>
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-kadin-gold bg-kadin-navy border-gray-600 rounded focus:ring-kadin-gold" checked={notificationPrefs.events} onChange={() => handleNotificationChange('events')} />
                                </label>
                                <label className="flex items-center justify-between text-sm">
                                    <span className="text-kadin-light-slate">KADIN News</span>
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-kadin-gold bg-kadin-navy border-gray-600 rounded focus:ring-kadin-gold" checked={notificationPrefs.news} onChange={() => handleNotificationChange('news')} />
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2">
                        <img className="h-10 w-10 rounded-full" src="https://picsum.photos/100" alt="User Avatar" />
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-kadin-white">Budi Santoso</p>
                            <p className="text-xs text-kadin-slate">Premium Member</p>
                        </div>
                    </button>
                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-kadin-light-navy rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                            <div className="py-1">
                                <a onClick={() => { setCurrentPage('Profile'); setProfileOpen(false); }} className="flex items-center px-4 py-2 text-sm text-kadin-slate hover:bg-kadin-navy hover:text-kadin-white cursor-pointer">
                                    <ProfileDropdownIcon className="h-5 w-5 mr-3" />
                                    My Profile
                                </a>
                                <a onClick={() => { setCurrentPage('Membership Card'); setProfileOpen(false); }} className="flex items-center px-4 py-2 text-sm text-kadin-slate hover:bg-kadin-navy hover:text-kadin-white cursor-pointer">
                                    <CardDropdownIcon className="h-5 w-5 mr-3" />
                                    Membership Card
                                </a>
                                <div className="border-t border-gray-600 my-1"></div>
                                <a onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-kadin-slate hover:bg-kadin-navy hover:text-kadin-white cursor-pointer">
                                    <LogoutIcon className="h-5 w-5 mr-3" />
                                    Sign Out
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
