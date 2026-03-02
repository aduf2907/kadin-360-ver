import React, { useState, useEffect } from "react";
import { KadinPartner } from "../types";
import { useKadinPartners } from "@/src/hooks/useKadinPartners";

const PartnerCard: React.FC<{
  partner: KadinPartner;
  onCardClick: () => void;
}> = ({ partner, onCardClick }) => (
  <div
    className="bg-kadin-light-navy rounded-lg border border-gray-700 p-6 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-300 h-full cursor-pointer hover:border-kadin-gold/50 group"
    onClick={onCardClick}
  >
    <div className="w-20 h-20 rounded-full mb-4 border-2 border-kadin-gold/50 bg-white p-2 overflow-hidden">
      <img
        src={partner.logoUrl}
        alt={`${partner.name} logo`}
        className="w-full h-full object-contain"
      />
    </div>
    <h3 className="text-xl font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">
      {partner.name}
    </h3>
    <p className="text-sm text-kadin-gold font-semibold mt-1">
      {partner.category}
    </p>
    <p className="text-sm text-kadin-slate mt-3 flex-grow line-clamp-3">
      {partner.description}
    </p>
    <div className="w-full mt-4 pt-4 border-t border-gray-700">
      <p className="text-xs text-kadin-light-slate">
        Exclusive Offer for KADIN Members:
      </p>
      <p className="text-md font-bold text-kadin-gold mt-1">{partner.offer}</p>
    </div>
    <button className="mt-4 w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors">
      View Details
    </button>
  </div>
);

const PartnerDetailModal: React.FC<{
  partner: KadinPartner;
  onClose: () => void;
}> = ({ partner, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-kadin-light-navy rounded-lg border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full border-2 border-kadin-gold/50 flex-shrink-0 bg-white p-2 overflow-hidden">
                <img
                  src={partner.logoUrl}
                  alt={`${partner.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-kadin-white">
                  {partner.name}
                </h2>
                <p className="text-md text-kadin-gold font-semibold">
                  {partner.category}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-kadin-slate hover:text-kadin-white"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

          <div className="mt-6 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-kadin-white mb-2">About</h3>
            <p className="text-sm text-kadin-slate whitespace-pre-wrap">
              {partner.about}
            </p>

            {partner.services && partner.services.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-kadin-white mt-6 mb-2">
                  Key Services
                </h3>
                <ul className="list-disc list-inside text-sm text-kadin-slate space-y-1">
                  {partner.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </>
            )}

            {partner.targetIndustries &&
              partner.targetIndustries.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-kadin-white mt-6 mb-2">
                    Target Industries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.targetIndustries.map((industry) => (
                      <span
                        key={industry}
                        className="text-xs bg-gray-700 text-kadin-light-slate px-3 py-1 rounded-full"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </>
              )}

            <h3 className="text-lg font-bold text-kadin-white mt-6 mb-2">
              Contact Information
            </h3>
            <div className="text-sm text-kadin-slate space-y-2">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${partner.contact.email}`}
                  className="text-kadin-gold hover:underline"
                >
                  {partner.contact.email}
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a
                  href={`tel:${partner.contact.phone}`}
                  className="text-kadin-gold hover:underline"
                >
                  {partner.contact.phone}
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={`https://${partner.contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-kadin-gold hover:underline"
                >
                  {partner.contact.website}
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-kadin-navy p-6 rounded-b-lg border-t border-gray-700">
          <h3 className="text-lg font-bold text-kadin-white">
            Exclusive KADIN Offer
          </h3>
          <p className="text-kadin-gold font-bold text-xl mt-1">
            {partner.offer}
          </p>
        </div>
      </div>
    </div>
  );
};

const Mitra: React.FC = () => {
  const { partners, loading } = useKadinPartners();
  const [selectedPartner, setSelectedPartner] = useState<KadinPartner | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [filteredPartners, setFilteredPartners] = useState<KadinPartner[]>([]);

  const categories = [
    "All Categories",
    ...new Set(partners.map((p) => p.category)),
  ];

  useEffect(() => {
    const filtered = partners.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" ||
        p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredPartners(filtered);
  }, [searchQuery, selectedCategory, partners]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-kadin-white mb-2">Mitra KADIN</h2>
      <p className="text-kadin-light-slate mb-8">
        Discover a curated directory of verified partners and service providers
        offering exclusive benefits to KADIN members.
      </p>

      <div className="bg-kadin-light-navy/50 p-4 rounded-lg border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by partner name or service..."
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
          Loading partners...
        </div>
      ) : filteredPartners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onCardClick={() => setSelectedPartner(partner)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-kadin-slate">
          No partners found matching your criteria.
        </div>
      )}

      {selectedPartner && (
        <PartnerDetailModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
        />
      )}
    </div>
  );
};

export default Mitra;
