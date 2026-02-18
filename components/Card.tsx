import React from 'react';

interface CardProps {
    title: string;
    onClick?: () => void;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, onClick, children }) => {
    const isClickable = !!onClick;
    return (
        <div 
            className={`bg-kadin-light-navy p-5 rounded-lg border border-gray-700 flex flex-col h-full group ${isClickable ? 'cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 hover:border-kadin-gold/50' : ''}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">{title}</h3>
            </div>
            <div className="flex-grow">
                {children}
            </div>
        </div>
    );
};

export default Card;