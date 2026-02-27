import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { getAiRecommendations } from "../services/geminiService";

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const UserCard: React.FC<{ user: UserProfile }> = ({ user }) => (
  <div className="bg-kadin-light-navy p-5 rounded-lg border border-gray-700 text-center relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
    {user.isAiRecommended && (
      <div className="absolute top-2 right-2 flex items-center bg-kadin-gold/10 text-kadin-gold px-2 py-1 rounded-full text-xs font-semibold">
        <StarIcon className="h-4 w-4 mr-1" />
        AI Match
      </div>
    )}
    <img
      src={user.avatar_url}
      alt={user.name}
      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-600"
    />
    <h3 className="text-lg font-bold text-kadin-white">{user.name}</h3>
    <p className="text-sm text-kadin-light-slate">
      {user.role} at {user.company}
    </p>
    <div className="mt-4 flex justify-center gap-2 flex-wrap">
      <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
        {user.industry}
      </span>
      <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
        {user.region}
      </span>
    </div>
    <button className="mt-4 w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg hover:bg-yellow-400 transition-colors">
      Connect
    </button>
  </div>
);

const Matching: React.FC = () => {
  const [partners, setPartners] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      const allPartners = await getAiRecommendations();
      setPartners(allPartners);
      setIsLoading(false);
    };
    fetchPartners();
  }, []);

  const recommendedPartners = partners.filter((p) => p.isAiRecommended);
  const otherPartners = partners.filter((p) => !p.isAiRecommended);

  return (
    <div>
      <h2 className="text-3xl font-bold text-kadin-white mb-6">
        Business Matching
      </h2>
      <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name, company, or interest..."
          className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full"
        />
        <select className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto">
          <option>All Industries</option>
          <option>Technology</option>
          <option>Agriculture</option>
          <option>Manufacturing</option>
        </select>
        <select className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto">
          <option>All Regions</option>
          <option>Jakarta</option>
          <option>Surabaya</option>
          <option>International</option>
        </select>
        <button className="w-full md:w-auto bg-kadin-gold text-kadin-navy font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors">
          Search
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-kadin-gold"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-kadin-light-slate ml-4 text-lg">
              Generating AI recommendations for you...
            </p>
          </div>
        </div>
      ) : (
        <>
          {recommendedPartners.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-kadin-white mb-4 flex items-center">
                <StarIcon className="h-6 w-6 text-kadin-gold mr-3" />
                AI Recommended Partners
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendedPartners.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-kadin-white mb-4 border-t border-gray-700 pt-8">
              Other Potential Partners
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {otherPartners.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Matching;
