import React, { useState } from 'react';
import { KadinEvent, Page, AgendaItem } from '../types';

// --- Icons for this page ---
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const LocationMarkerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
// --- End Icons ---

interface EventDetailsProps {
    event: KadinEvent;
    setCurrentPage: (page: Page) => void;
}

const AddAgendaItemModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddItem: (item: AgendaItem) => void;
}> = ({ isOpen, onClose, onAddItem }) => {
    const [newItem, setNewItem] = useState({ time: '', title: '', speaker: '', description: '' });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.time || !newItem.title || !newItem.description) return;
        onAddItem(newItem);
        setNewItem({ time: '', title: '', speaker: '', description: '' }); // Reset form
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-kadin-light-navy rounded-lg border border-gray-700 shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-kadin-white mb-4">Add New Agenda Item</h3>
                        <div className="space-y-4">
                            <input type="text" name="time" value={newItem.time} onChange={handleChange} placeholder="Time (e.g., 10:30 - 11:00)" required className="w-full bg-kadin-navy p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            <input type="text" name="title" value={newItem.title} onChange={handleChange} placeholder="Session Title" required className="w-full bg-kadin-navy p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            <input type="text" name="speaker" value={newItem.speaker} onChange={handleChange} placeholder="Speaker (Optional)" className="w-full bg-kadin-navy p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            <textarea name="description" value={newItem.description} onChange={handleChange} rows={3} placeholder="Description" required className="w-full bg-kadin-navy p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                        </div>
                    </div>
                    <div className="bg-kadin-navy p-4 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors">Cancel</button>
                        <button type="submit" className="bg-kadin-gold text-kadin-navy font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors">Save Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const EventDetails: React.FC<EventDetailsProps> = ({ event, setCurrentPage }) => {
    const [activeTab, setActiveTab] = useState<'agenda' | 'speakers' | 'location'>('agenda');
    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(event.agenda);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registrationState, setRegistrationState] = useState<'not_registered' | 'registering' | 'registered'>('not_registered');
    const [registrantCount, setRegistrantCount] = useState(event.registrants);


    const isFull = registrantCount >= event.capacity;
    const isCompleted = event.status === 'Completed';

    const handleRegister = () => {
        if (registrationState !== 'not_registered' || isFull || isCompleted) return;

        setRegistrationState('registering');
        // Simulate API call
        setTimeout(() => {
            setRegistrationState('registered');
            setRegistrantCount(prev => prev + 1);
        }, 1500);
    };

    const getButtonState = () => {
        if (isCompleted) return { text: 'Event Completed', disabled: true, className: 'bg-gray-600 text-white cursor-not-allowed' };
        if (registrationState === 'registered') return { text: 'Registered', disabled: true, className: 'bg-green-600 text-white cursor-not-allowed' };
        if (isFull) return { text: 'Registration Full', disabled: true, className: 'bg-red-600 text-white cursor-not-allowed' };
        if (registrationState === 'registering') return { text: 'Registering...', disabled: true, className: 'bg-kadin-gold/50 text-kadin-navy cursor-wait' };
        return { text: 'Register Now', disabled: false, className: 'bg-kadin-gold text-kadin-navy hover:bg-yellow-400' };
    };

    const buttonState = getButtonState();

    return (
        <div className="max-w-6xl mx-auto">
            <button onClick={() => setCurrentPage('Event Management')} className="text-sm text-kadin-gold hover:underline mb-4 inline-flex items-center">
                &larr; Back to Event List
            </button>
            
            {/* Header */}
            <div className="bg-kadin-light-navy p-8 rounded-lg border border-gray-700 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <span className="text-sm font-semibold bg-kadin-gold/10 text-kadin-gold px-3 py-1 rounded-full">{event.type}</span>
                        <h2 className="text-4xl font-extrabold text-kadin-white mt-3">{event.name}</h2>
                        <div className="flex flex-col md:flex-row md:items-center gap-x-6 gap-y-2 mt-4 text-kadin-slate">
                            <div className="flex items-center"><CalendarIcon className="h-5 w-5 mr-2 text-kadin-gold" /> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <div className="flex items-center"><LocationMarkerIcon className="h-5 w-5 mr-2 text-kadin-gold" /> {event.location}</div>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 md:text-right flex-shrink-0">
                         <button 
                            onClick={handleRegister}
                            disabled={buttonState.disabled} 
                            className={`font-bold py-3 px-8 rounded-lg transition-colors ${buttonState.className}`}
                        >
                            {buttonState.text}
                        </button>
                        <p className="text-sm text-kadin-slate mt-2">{registrantCount.toLocaleString()} / {event.capacity.toLocaleString()} spots filled</p>
                    </div>
                </div>
                 <p className="text-kadin-light-slate mt-6 border-t border-gray-700 pt-6">{event.description}</p>
            </div>

            {/* Tabs */}
            <div className="mb-8">
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('agenda')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'agenda' ? 'border-kadin-gold text-kadin-gold' : 'border-transparent text-kadin-slate hover:text-kadin-white'}`}>Agenda</button>
                        <button onClick={() => setActiveTab('speakers')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'speakers' ? 'border-kadin-gold text-kadin-gold' : 'border-transparent text-kadin-slate hover:text-kadin-white'}`}>Speakers</button>
                        <button onClick={() => setActiveTab('location')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'location' ? 'border-kadin-gold text-kadin-gold' : 'border-transparent text-kadin-slate hover:text-kadin-white'}`}>Location</button>
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-kadin-light-navy p-8 rounded-lg border border-gray-700 min-h-[400px]">
                {activeTab === 'agenda' && (
                    <div>
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-kadin-white">Event Schedule</h3>
                            <button onClick={() => setIsModalOpen(true)} className="bg-kadin-gold text-kadin-navy font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors text-sm">
                                Add Agenda Item
                            </button>
                        </div>
                        {agendaItems.length > 0 ? (
                             <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent via-gray-700 to-transparent">
                                {agendaItems.map((item, index) => (
                                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-kadin-gold bg-kadin-navy text-kadin-gold text-sm font-semibold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">{item.time}</div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-kadin-navy p-4 rounded-lg border border-gray-700 ml-4 md:ml-0">
                                            <h4 className="font-bold text-kadin-white">{item.title}</h4>
                                            {item.speaker && <p className="text-xs text-kadin-gold font-semibold mt-1">Speaker: {item.speaker}</p>}
                                            <p className="text-sm text-kadin-slate mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-kadin-slate text-center py-8">The detailed agenda has not been set yet. Click "Add Agenda Item" to start building the schedule.</p>
                        )}
                    </div>
                )}
                {activeTab === 'speakers' && (
                     <div>
                        <h3 className="text-2xl font-bold text-kadin-white mb-6">Featured Speakers</h3>
                        {event.speakers.length > 0 ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {event.speakers.map(speaker => (
                                    <div key={speaker.id} className="flex items-start gap-4">
                                        <img src={speaker.avatar} alt={speaker.name} className="w-24 h-24 rounded-full flex-shrink-0 border-4 border-gray-600"/>
                                        <div>
                                            <h4 className="text-lg font-bold text-kadin-white">{speaker.name}</h4>
                                            <p className="text-sm text-kadin-gold font-semibold">{speaker.title}</p>
                                            <p className="text-sm text-kadin-slate mt-2">{speaker.bio}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-kadin-slate">Speaker information is not yet available for this event.</p>
                        )}
                    </div>
                )}
                {activeTab === 'location' && (
                    <div>
                        <h3 className="text-2xl font-bold text-kadin-white mb-6">Venue & Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-kadin-white">Address</h4>
                                <p className="text-kadin-slate mt-1">{event.location}</p>
                                <p className="text-kadin-slate">Jl. Gatot Subroto No.Kav. 36-38, RT.8/RW.3, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12950</p>
                                <a href="https://maps.google.com/?q=Jakarta+Convention+Center" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 bg-kadin-gold/10 text-kadin-gold font-semibold py-2 px-4 rounded-lg hover:bg-kadin-gold/20 transition-colors">
                                    Open in Google Maps
                                </a>
                            </div>
                             <div className="rounded-lg overflow-hidden border-2 border-kadin-gold/50">
                                <a href="https://maps.google.com/?q=Jakarta+Convention+Center" target="_blank" rel="noopener noreferrer">
                                     <img src="https://maps.googleapis.com/maps/api/staticmap?center=Jakarta+Convention+Center&zoom=15&size=600x400&maptype=roadmap&markers=color:0xD4AF37%7Clabel:V%7CJakarta+Convention+Center&style=feature:all|element:all|color:0x0A192F&style=feature:road|element:geometry|color:0x8892b0&style=feature:poi|element:labels|visibility:off&style=feature:transit|element:labels|visibility:off&style=feature:administrative|element:labels.text.fill|color:0xe6f1ff&key=NO_API_KEY_NEEDED_FOR_DEMO" alt="Map of JCC" className="w-full h-full object-cover"/>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

             {/* Sponsors */}
            {event.sponsors.length > 0 && (
                 <div className="mt-12">
                    <h3 className="text-2xl font-bold text-kadin-white text-center mb-6">Our Sponsors</h3>
                    <div className="flex justify-center items-center gap-8 flex-wrap">
                        {event.sponsors.map(sponsor => (
                            <div key={sponsor.id} className="grayscale hover:grayscale-0 transition-all duration-300" title={sponsor.name}>
                                <img src={sponsor.logoUrl} alt={sponsor.name} className="h-16" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <AddAgendaItemModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddItem={(item) => setAgendaItems(prev => [...prev, item])}
            />
        </div>
    );
};

export default EventDetails;