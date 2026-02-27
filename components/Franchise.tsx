// FIX: Create a new Franchise component with mock data to replace the placeholder content.
import React, { useState, useEffect } from "react";
import { FranchiseOpportunity } from "../types";
import { useFranchises } from "@/src/hooks/useFranchise";

const FranchiseCard: React.FC<{
  franchise: FranchiseOpportunity;
  onLearnMore: (f: FranchiseOpportunity) => void;
}> = ({ franchise, onLearnMore }) => (
  <div
    className="bg-kadin-light-navy rounded-lg overflow-hidden border border-gray-700 transform hover:-translate-y-1 transition-transform duration-300 flex flex-col cursor-pointer hover:border-kadin-gold/50 group"
    onClick={() => onLearnMore(franchise)}
  >
    <img
      src={franchise.imageUrl}
      alt={franchise.name}
      className="w-full h-48 object-cover"
    />
    <div className="p-4 flex flex-col flex-grow">
      <span className="text-xs font-semibold text-kadin-gold bg-kadin-gold/10 px-2 py-1 rounded-full self-start">
        {franchise.category}
      </span>
      <h3 className="text-lg font-bold mt-2 text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">
        {franchise.name}
      </h3>
      <p className="text-sm mt-2 text-kadin-slate flex-grow line-clamp-3">
        {franchise.description}
      </p>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-kadin-light-slate">Investment Range</p>
        <p className="font-semibold text-kadin-white">{franchise.investment}</p>
      </div>
      <button
        className="mt-4 w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onLearnMore(franchise);
        }}
      >
        Learn More
      </button>
    </div>
  </div>
);

const Franchise: React.FC = () => {
  const { franchises, loading } = useFranchises();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [filteredFranchises, setFilteredFranchises] = useState<
    FranchiseOpportunity[]
  >([]);
  const [selectedFranchise, setSelectedFranchise] =
    useState<FranchiseOpportunity | null>(null);

  const categories = [
    "All Categories",
    ...new Set(franchises.map((f) => f.category)),
  ];

  useEffect(() => {
    const filtered = franchises.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" ||
        f.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredFranchises(filtered);
  }, [searchQuery, selectedCategory, franchises]);

  return (
    <div className="relative">
      <h2 className="text-3xl font-bold text-kadin-white mb-6">
        Franchise Opportunities
      </h2>

      <div className="bg-kadin-light-navy/50 p-4 rounded-lg border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by franchise name or category..."
          className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-kadin-slate">
          Loading franchises...
        </div>
      ) : filteredFranchises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFranchises.map((franchise) => (
            <FranchiseCard
              key={franchise.id}
              franchise={franchise}
              onLearnMore={setSelectedFranchise}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-kadin-slate">
          No franchises found matching your criteria.
        </div>
      )}

      {/* Franchise Detail Modal */}
      {selectedFranchise && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="relative h-64">
              <img
                src={selectedFranchise.imageUrl}
                alt={selectedFranchise.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedFranchise(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-kadin-gold bg-kadin-gold/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedFranchise.category}
                </span>
              </div>

              <h3 className="text-3xl font-bold text-kadin-white mb-4">
                {selectedFranchise.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-kadin-navy p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-kadin-slate uppercase font-bold mb-1">
                    Investment Range
                  </p>
                  <p className="text-xl font-bold text-kadin-gold">
                    {selectedFranchise.investment}
                  </p>
                </div>
                <div className="bg-kadin-navy p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-kadin-slate uppercase font-bold mb-1">
                    Location / HQ
                  </p>
                  <p className="text-lg font-semibold text-kadin-white">
                    {selectedFranchise.location || "Not Specified"}
                  </p>
                </div>
                <div className="bg-kadin-navy p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-kadin-slate uppercase font-bold mb-1">
                    Established Since
                  </p>
                  <p className="text-lg font-semibold text-kadin-white">
                    {selectedFranchise.established || "-"}
                  </p>
                </div>
                <div className="bg-kadin-navy p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-kadin-slate uppercase font-bold mb-1">
                    Total Outlets
                  </p>
                  <p className="text-lg font-semibold text-kadin-white">
                    {selectedFranchise.outlets || "-"}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-bold text-kadin-white mb-2 border-b border-gray-700 pb-2">
                  About the Brand
                </h4>
                <p className="text-kadin-slate leading-relaxed">
                  {selectedFranchise.description}
                </p>
              </div>

              {selectedFranchise.contact && (
                <div className="bg-kadin-navy/50 p-6 rounded-xl border border-kadin-gold/20">
                  <h4 className="text-md font-bold text-kadin-white mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-kadin-gold"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact for Partnership
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-kadin-white">
                      <span className="text-kadin-slate">PIC:</span>{" "}
                      {selectedFranchise.contact.name}
                    </p>
                    <p className="text-kadin-gold hover:underline cursor-pointer">
                      <span className="text-kadin-slate">Email:</span>{" "}
                      {selectedFranchise.contact.email}
                    </p>
                    <p className="text-kadin-gold hover:underline cursor-pointer">
                      <span className="text-kadin-slate">Phone:</span>{" "}
                      {selectedFranchise.contact.phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                <button
                  className="flex-1 bg-kadin-gold text-kadin-navy font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-kadin-gold/10"
                  onClick={() =>
                    alert("Application form will be sent to your email.")
                  }
                >
                  Apply for Franchise
                </button>
                <button
                  className="px-6 py-3 border border-gray-700 text-kadin-white font-bold rounded-xl hover:bg-gray-800 transition-all"
                  onClick={() => setSelectedFranchise(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Franchise;
