import React from 'react';

const ChatbotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h6l2-2h2l-2 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11.25l.6-1.2 1.2-.6-1.2-.6-.6-1.2-.6 1.2-1.2.6 1.2.6.6 1.2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 8.25l.4-.8.8-.4-.8-.4-.4-.8-.4.8-.8.4.8.4.4.8z" />
    </svg>
);

export default ChatbotIcon;
