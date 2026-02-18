

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { UserProfile, ActivityEvent } from '../types';
import ChatbotIcon from './icons/ChatbotIcon';

// Close Icon
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Send Icon
const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

// Search Icon
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


interface Message {
    sender: 'user' | 'ai';
    text: string;
}

interface AIChatbotProps {
    userProfile: UserProfile;
    logUserActivity: (type: ActivityEvent['type'], payload: string) => void;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ userProfile, logUserActivity }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        if (nextState) {
            logUserActivity('chatbot_interaction', 'chatbot_opened');
            // When opening, set initial message
             setTimeout(() => {
                setMessages([{ sender: 'ai', text: `Hello ${userProfile.name}! I'm your KADIN 360 AI Assistant. How can I help you navigate the platform today?` }]);
            }, 100);
        } else {
            logUserActivity('chatbot_interaction', 'chatbot_closed');
            // When closing, reset state
            chatRef.current = null;
            setMessages([]);
            setInput('');
            setIsLoading(false);
            setSearchTerm('');
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        
        logUserActivity('chatbot_interaction', 'message_sent');
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            if (!chatRef.current) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const systemInstruction = `
                    // --- PRIME DIRECTIVE: HYPER-PERSONALIZED STRATEGIC ADVISOR V2.0 --- //

                    // **IDENTITY & PERSONA**
                    You are the "KADIN 360 Advisor," an elite AI business strategist and a digital Chief of Staff for the user. Your persona is sharp, insightful, proactive, and relentlessly focused on delivering tangible business value. You are a C-suite level partner, not a generic chatbot. Your primary mission is to accelerate the user's business success by strategically leveraging the KADIN 360 platform.

                    // **CRITICAL USER CONTEXT (Your Unwavering Focus)**
                    This is the user you are exclusively serving. ALL your responses MUST be hyper-personalized based on this data. Generic, non-contextual advice is a critical failure.
                    - **Name**: ${userProfile.name}
                    - **Role**: ${userProfile.role} at ${userProfile.company}
                    - **Industry**: ${userProfile.industry}
                    - **Interests**: ${userProfile.interests.join(', ')}

                    // **MANDATORY OPERATING PROTOCOLS**

                    1.  **ANTICIPATORY INTELLIGENCE (Be Proactive)**: Do not just wait for questions. Anticipate needs. Based on the user's role and industry, think about their typical challenges. For a **'${userProfile.role}'** in the **'${userProfile.industry}'** sector, this might involve fundraising, supply chain optimization, market expansion, or talent acquisition. Proactively surface relevant members, articles, or forums that address these potential pain points.

                    2.  **DEEP PERSONALIZATION (Mandatory)**: Before answering, always consider: "For ${userProfile.name}, what is the most strategic next step they could take on this platform *right now*?" You MUST reference their profile details (role, industry, interests) in your responses to demonstrate deep contextual understanding.

                    3.  **STRATEGIC SYNTHESIS (Your Key Value)**: Do not just point to a single feature. Your value is in creating pathways.
                        - **Connect the Dots**: When recommending a resource, explain *why* it is strategically valuable to *this specific user's* goals. If possible, link multiple resources together. For example, "I suggest you start with the 'Export Strategy Masterclass' in the **Knowledge Hub**. Afterwards, connect with Rina Hartono from the **Member Directory**, who is an expert in manufacturing exports, to discuss practical implementation."
                        - **Provide Actionable Steps**: Every suggestion must end with a clear, concrete, and actionable next step the user can take on the platform.

                    4.  **MAINTAIN EXECUTIVE TONE**: Be professional, concise, confident, and frame all suggestions in terms of value, ROI, and strategic advantage.

                    // --- EXAMPLE OF A HIGH-QUALITY INTERACTION --- //

                    *   **User**: "Any new opportunities for me?"
                    *   **Your Response (Correct)**: "Welcome back, ${userProfile.name}. Recognizing your interest in '${userProfile.interests[0]}' and your role as a **${userProfile.role}** in the **${userProfile.industry}** sector, I've identified a strategic opportunity. There is a new discussion thread in the **KADINers Rooms** titled 'Challenges in Supply Chain for Manufacturing'. Participating in this could provide valuable insights. Furthermore, I recommend connecting with Andi Wijaya from PT. Maju Logistik, a featured expert in that discussion. A conversation with him could directly address potential logistics optimizations for ${userProfile.company}."
                    *   **Your Response (Incorrect)**: "You can check the KADINers Rooms for new discussions."
                `;
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                });
            }
            
            const response = await chatRef.current.sendMessage({ message: currentInput });
            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("AI Chatbot Error:", error);
            const errorMessage: Message = { sender: 'ai', text: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredMessages = messages.filter(msg => 
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-4 md:right-8 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-kadin-light-navy rounded-lg shadow-2xl border border-gray-700 flex flex-col transition-all duration-300 ease-in-out z-40 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <h3 className="text-lg font-bold text-kadin-white">AI Assistant</h3>
                    <button onClick={toggleChat} className="text-kadin-slate hover:text-kadin-white">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-2 border-b border-gray-700 flex-shrink-0">
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-kadin-slate" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search history..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-kadin-navy p-2 pl-10 rounded-full focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm"
                        />
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {filteredMessages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-kadin-navy flex items-center justify-center"><ChatbotIcon className="h-5 w-5 text-kadin-gold"/></div>}
                            <div className={`max-w-xs md:max-w-sm rounded-lg p-3 ${msg.sender === 'user' ? 'bg-kadin-gold text-kadin-navy' : 'bg-gray-700 text-kadin-white'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-kadin-navy flex items-center justify-center"><ChatbotIcon className="h-5 w-5 text-kadin-gold"/></div>
                             <div className="max-w-xs md:max-w-sm rounded-lg p-3 bg-gray-700 text-kadin-white">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-kadin-gold rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-kadin-gold rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-kadin-gold rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex items-center space-x-3 flex-shrink-0">
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        className="flex-1 bg-kadin-navy p-3 rounded-full focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="p-3 rounded-full bg-kadin-gold text-kadin-navy hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                        <SendIcon className="h-6 w-6"/>
                    </button>
                </form>
            </div>

            {/* FAB */}
            <button
                onClick={toggleChat}
                className="fixed bottom-4 right-4 md:right-8 bg-kadin-gold text-kadin-navy p-4 rounded-full shadow-lg hover:bg-yellow-400 transform hover:scale-110 transition-all duration-200 z-50"
                aria-label="Open AI Chat"
            >
                <ChatbotIcon className="h-8 w-8" />
            </button>
        </>
    );
};

export default AIChatbot;
