import React, { useState, useEffect } from "react";
import { useBusinessAdvisor } from "@/src/hooks/useBusinessAdvisor";
import { UserProfile, BusinessConsultation } from "../types";
import Card from "./Card";

// --- Inline SVG Icons for this page ---
const CompassIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.657-4.657l-1.414-1.414M6.757 17.243l-1.414-1.414m0-9.172l1.414 1.414M17.243 17.243l1.414 1.414"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 15l-3-6 6 3-3-3z"
    />
  </svg>
);

const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  </svg>
);

const GlobeAltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.75 9h16.5M3.75 15h16.5M9.75 3.75c.493 2.12.83 4.417.994 6.75m2.512 0c.164-2.333.493-4.63.994-6.75M12 21v-3.375"
    />
  </svg>
);

const CpuChipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75zM3.75 4.5v.75A.75.75 0 013 6v12a.75.75 0 01.75.75v.75m16.5 0v-.75a.75.75 0 00-.75-.75V6a.75.75 0 00-.75-.75v-.75"
    />
  </svg>
);

interface BusinessAdvisorProps {
  user: UserProfile;
}

const BusinessAdvisor: React.FC<BusinessAdvisorProps> = ({ user }) => {
  const {
    advisors,
    consultations,
    loading,
    fetchAdvisors,
    fetchConsultations,
    submitConsultation,
  } = useBusinessAdvisor();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    category: "Strategic Planning",
    description: "",
  });
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    fetchAdvisors();
    if (user.id) {
      fetchConsultations(user.id.toString());
    }
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await submitConsultation(
      {
        ...formData,
        user_id: user.id.toString(),
      },
      attachment || undefined,
    );

    if (res.success) {
      setShowForm(false);
      setFormData({
        subject: "",
        category: "Strategic Planning",
        description: "",
      });
      setAttachment(null);
      fetchConsultations(user.id.toString());
      alert("Consultation submitted successfully!");
    } else {
      alert("Error: " + res.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="relative bg-kadin-light-navy p-12 rounded-lg border border-gray-700 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://picsum.photos/seed/strategy/1200/400')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-kadin-light-navy via-kadin-light-navy/80 to-kadin-light-navy/50"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-kadin-white mb-3">
            KADIN Business Advisor
          </h2>
          <p className="text-xl text-kadin-gold font-semibold mb-4">
            Expert Guidance for Your Business Growth
          </p>
          <p className="text-lg text-kadin-slate max-w-3xl mx-auto">
            Connect with a curated network of seasoned industry veterans and
            functional experts to navigate your most pressing business
            challenges and unlock new opportunities.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-8 bg-kadin-gold text-kadin-navy font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors text-lg"
          >
            Book Your First Consultation
          </button>
        </div>
      </div>

      {/* Consultation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-kadin-light-navy w-full max-w-2xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-kadin-white">
                Request Business Consultation
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-kadin-slate hover:text-kadin-white"
              >
                <svg
                  className="h-6 w-6"
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-kadin-light-slate mb-1">
                    Subject
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-kadin-navy border border-gray-600 rounded-lg px-4 py-2 text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                    placeholder="e.g. Market Entry Strategy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-kadin-light-slate mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-kadin-navy border border-gray-600 rounded-lg px-4 py-2 text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  >
                    <option>Strategic Planning</option>
                    <option>Financial Advisory</option>
                    <option>Market Expansion</option>
                    <option>Digital Transformation</option>
                    <option>Operational Efficiency</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-light-slate mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-kadin-navy border border-gray-600 rounded-lg px-4 py-2 text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none h-32"
                  placeholder="Describe your business challenge or goal..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-light-slate mb-1">
                  Supporting Document (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  className="w-full text-sm text-kadin-slate file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-kadin-gold file:text-kadin-navy hover:file:bg-yellow-400"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-kadin-gold text-kadin-navy py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors mt-4 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* My Consultations Section */}
      {consultations.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-kadin-white mb-6">
            My Consultations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultations.map((c) => (
              <Card key={c.id} title={c.subject}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-kadin-gold font-bold uppercase tracking-wider">
                    {c.category}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      c.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : c.status === "in_progress"
                          ? "bg-blue-500/20 text-blue-500"
                          : c.status === "resolved"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {c.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-kadin-slate line-clamp-2 mb-4">
                  {c.description}
                </p>
                {c.admin_response && (
                  <div className="mt-4 p-3 bg-kadin-navy rounded border border-gray-700">
                    <p className="text-xs text-kadin-gold font-bold uppercase mb-1">
                      Advisor Response:
                    </p>
                    <p className="text-sm text-kadin-white italic">
                      "{c.admin_response}"
                    </p>
                  </div>
                )}
                <div className="mt-4 text-[10px] text-kadin-slate text-right">
                  Submitted on {new Date(c.created_at).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Service Pillars Section */}
      <div>
        <h3 className="text-2xl font-bold text-kadin-white text-center mb-8">
          How We Can Help
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-gray-700/50 text-center">
            <CompassIcon className="h-12 w-12 text-kadin-gold mx-auto mb-4" />
            <h4 className="text-xl font-bold text-kadin-white">
              Strategic Planning
            </h4>
            <p className="text-kadin-slate text-sm mt-2">
              Develop robust, long-term strategies for sustainable growth,
              market positioning, and competitive advantage.
            </p>
          </div>
          <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-gray-700/50 text-center">
            <ChartBarIcon className="h-12 w-12 text-kadin-gold mx-auto mb-4" />
            <h4 className="text-xl font-bold text-kadin-white">
              Financial Advisory
            </h4>
            <p className="text-kadin-slate text-sm mt-2">
              Optimize your financial health with expert advice on fundraising,
              capital allocation, and profitability analysis.
            </p>
          </div>
          <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-gray-700/50 text-center">
            <GlobeAltIcon className="h-12 w-12 text-kadin-gold mx-auto mb-4" />
            <h4 className="text-xl font-bold text-kadin-white">
              Market Expansion
            </h4>
            <p className="text-kadin-slate text-sm mt-2">
              Navigate the complexities of entering new domestic or
              international markets, from research to execution.
            </p>
          </div>
          <div className="bg-kadin-light-navy/50 p-6 rounded-lg border border-gray-700/50 text-center">
            <CpuChipIcon className="h-12 w-12 text-kadin-gold mx-auto mb-4" />
            <h4 className="text-xl font-bold text-kadin-white">
              Digital Transformation
            </h4>
            <p className="text-kadin-slate text-sm mt-2">
              Leverage technology to streamline operations, enhance customer
              experience, and build a future-proof business.
            </p>
          </div>
        </div>
      </div>

      {/* Meet the Advisors Section */}
      <div>
        <h3 className="text-2xl font-bold text-kadin-white text-center mb-8">
          Meet Our Esteemed Advisors
        </h3>
        <div className="space-y-8">
          {advisors.length > 0 ? (
            advisors.map((advisor) => (
              <div
                key={advisor.id}
                className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700 flex flex-col md:flex-row items-center gap-6 transform hover:-translate-y-1 transition-transform duration-300"
              >
                <img
                  src={
                    advisor.avatar_url ||
                    "https://picsum.photos/seed/advisor/200/200"
                  }
                  alt={advisor.name}
                  className="w-32 h-32 rounded-full flex-shrink-0 border-4 border-kadin-gold/50 object-cover"
                />
                <div className="text-center md:text-left">
                  <h4 className="text-xl font-bold text-kadin-white">
                    {advisor.name}
                  </h4>
                  <p className="text-md text-kadin-gold font-semibold">
                    {advisor.specialization}
                  </p>
                  <p className="text-sm text-kadin-slate mt-2">{advisor.bio}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-12 bg-kadin-light-navy rounded-lg border border-dashed border-gray-700 text-kadin-slate italic">
              No advisors available at the moment.
            </div>
          )}
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center p-8 bg-kadin-gold/10 rounded-lg border border-kadin-gold/20">
        <h3 className="text-2xl font-bold text-kadin-white">
          Ready to Elevate Your Business?
        </h3>
        <p className="text-kadin-slate mt-2 mb-6 max-w-2xl mx-auto">
          Take the decisive step towards strategic clarity and accelerated
          growth. Our advisors are ready to partner with you on your journey to
          success.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="bg-kadin-gold text-kadin-navy font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors text-lg"
        >
          Schedule Your Consultation Now
        </button>
      </div>
    </div>
  );
};

export default BusinessAdvisor;
