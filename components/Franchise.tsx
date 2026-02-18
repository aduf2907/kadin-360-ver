// FIX: Create a new Franchise component with mock data to replace the placeholder content.
import React from 'react';
import { FranchiseOpportunity } from '../types';

const mockFranchises: FranchiseOpportunity[] = [
    {
        id: 1,
        name: 'Kopi Kenangan',
        category: 'Food & Beverage',
        investment: 'IDR 200 - 500 Million',
        imageUrl: 'https://picsum.photos/seed/franchise1/400/200',
        description: 'A leading coffee chain in Indonesia, offering a modern grab-and-go concept with high-quality local beans.'
    },
    {
        id: 2,
        name: 'Indomaret',
        category: 'Retail',
        investment: 'IDR 400 - 600 Million',
        imageUrl: 'https://picsum.photos/seed/franchise2/400/200',
        description: 'Indonesia\'s largest convenience store chain with a strong brand presence and extensive supply chain network.'
    },
    {
        id: 3,
        name: 'J&T Express',
        category: 'Logistics & Delivery',
        investment: 'IDR 100 - 300 Million',
        imageUrl: 'https://picsum.photos/seed/franchise3/400/200',
        description: 'A fast-growing technology-based express delivery service, offering partnership opportunities for drop points and agents.'
    },
    {
        id: 4,
        name: 'Apotek K-24',
        category: 'Healthcare & Pharmacy',
        investment: 'IDR 800 Million - 1.2 Billion',
        imageUrl: 'https://picsum.photos/seed/franchise4/400/200',
        description: 'A well-known 24-hour pharmacy chain committed to providing comprehensive and reliable health services to the community.'
    }
];

const FranchiseCard: React.FC<{ franchise: FranchiseOpportunity }> = ({ franchise }) => (
    <div className="bg-kadin-light-navy rounded-lg overflow-hidden border border-gray-700 transform hover:-translate-y-1 transition-transform duration-300 flex flex-col cursor-pointer hover:border-kadin-gold/50 group" onClick={() => alert(`Navigating to franchise: ${franchise.name}`)}>
        <img src={franchise.imageUrl} alt={franchise.name} className="w-full h-48 object-cover"/>
        <div className="p-4 flex flex-col flex-grow">
            <span className="text-xs font-semibold text-kadin-gold bg-kadin-gold/10 px-2 py-1 rounded-full self-start">{franchise.category}</span>
            <h3 className="text-lg font-bold mt-2 text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">{franchise.name}</h3>
            <p className="text-sm mt-2 text-kadin-slate flex-grow">{franchise.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-kadin-light-slate">Investment Range</p>
                <p className="font-semibold text-kadin-white">{franchise.investment}</p>
            </div>
            <button className="mt-4 w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors" onClick={(e) => e.stopPropagation()}>
                Learn More
            </button>
        </div>
    </div>
);


const Franchise: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-6">Franchise Opportunities</h2>

            <div className="bg-kadin-light-navy/50 p-4 rounded-lg border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <input type="text" placeholder="Search by franchise name or category..." className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full"/>
                <select className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto">
                    <option>All Categories</option>
                    <option>Food & Beverage</option>
                    <option>Retail</option>
                    <option>Logistics</option>
                    <option>Healthcare</option>
                </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockFranchises.map(franchise => (
                    <FranchiseCard key={franchise.id} franchise={franchise} />
                ))}
            </div>
        </div>
    );
};

export default Franchise;