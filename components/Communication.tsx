
import React, { useState } from 'react';
import { ChatMessage } from '../types';

const TranslateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 1h5l-5 5h5l-5 5M4 17h5m-5-5h5m2 0h5M12 21a9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9z" />
    </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);


const mockMessages: ChatMessage[] = [
    { id: 1, sender: 'contact', text: 'Hello! I saw your profile and I am interested in your logistics services.', timestamp: '10:30 AM' },
    { id: 2, sender: 'user', text: 'Hi Citra, thanks for reaching out. We specialize in cross-border logistics. How can I help?', timestamp: '10:31 AM' },
    { id: 3, sender: 'contact', text: 'Great! We need to ship goods from Jakarta to Singapore. Can you provide a quote?', timestamp: '10:32 AM' },
];


const Communication: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const msg: ChatMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, msg]);
        setNewMessage('');
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-6">Communication Hub</h2>
            <div className="flex h-[70vh] rounded-lg overflow-hidden bg-kadin-light-navy border border-gray-700">
                {/* Contact List */}
                <div className="w-1/3 border-r border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-700">
                        <input type="text" placeholder="Search contacts..." className="w-full bg-kadin-navy p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-kadin-gold" />
                    </div>
                    <ul className="flex-1 overflow-y-auto">
                        <li className="flex items-center p-4 cursor-pointer bg-kadin-navy border-b border-l-4 border-l-kadin-gold border-b-gray-700">
                             <img src="https://picsum.photos/id/1011/50/50" className="h-12 w-12 rounded-full mr-4" alt="contact"/>
                             <div className="flex-1">
                                 <p className="font-semibold text-kadin-white">Citra Lestari</p>
                                 <p className="text-xs text-kadin-slate truncate">Great! We need to ship goods from...</p>
                             </div>
                        </li>
                         <li className="flex items-center p-4 cursor-pointer hover:bg-kadin-navy/50 border-b border-gray-700">
                             <img src="https://picsum.photos/id/1027/50/50" className="h-12 w-12 rounded-full mr-4" alt="contact"/>
                             <div className="flex-1">
                                 <p className="font-semibold text-kadin-white">Andi Wijaya</p>
                                 <p className="text-xs text-kadin-slate truncate">Let's schedule a meeting for Friday.</p>
                             </div>
                        </li>
                    </ul>
                </div>
                {/* Chat Window */}
                <div className="w-2/3 flex flex-col">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-kadin-white text-lg">Chat with Citra Lestari</h3>
                        <button className="text-kadin-slate hover:text-kadin-gold">
                            {/* Video Call Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'contact' && <img src="https://picsum.photos/id/1011/40/40" className="h-8 w-8 rounded-full" alt="avatar"/>}
                                <div className={`max-w-md rounded-lg p-3 ${msg.sender === 'user' ? 'bg-kadin-gold text-kadin-navy' : 'bg-gray-700 text-kadin-white'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>{msg.timestamp}</p>
                                </div>
                                {msg.sender === 'contact' && <button title="Translate Message" className="text-kadin-slate hover:text-kadin-gold"><TranslateIcon className="h-5 w-5"/></button>}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-700 flex items-center">
                        <input 
                            type="text" 
                            placeholder="Type your message..." 
                            className="flex-1 bg-kadin-navy p-3 rounded-full focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage} className="ml-4 p-3 rounded-full bg-kadin-gold text-kadin-navy hover:bg-yellow-400 transition-colors">
                            <SendIcon className="h-6 w-6"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Communication;
