import React, { useState, useEffect } from "react";
import { useLegal } from "@/src/hooks/useLegal";
import { LegalConsultation, LegalAdvisor, UserProfile } from "../types";
import Card from "./Card";

interface LegalManagementProps {
  user: UserProfile;
}

const LegalManagement: React.FC<LegalManagementProps> = ({ user }) => {
  const {
    advisors,
    consultations,
    loading,
    fetchAdvisors,
    fetchConsultations,
    addAdvisor,
    respondToConsultation,
  } = useLegal();

  const [activeTab, setActiveTab] = useState<"consultations" | "advisors">(
    "consultations",
  );
  const [selectedConsultation, setSelectedConsultation] =
    useState<LegalConsultation | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [isAddingAdvisor, setIsAddingAdvisor] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState({
    name: "",
    specialization: "",
    bio: "",
    avatar_url: "",
  });
  const [advisorImage, setAdvisorImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultations();
    fetchAdvisors();
  }, []);

  const handleRespond = async (status: LegalConsultation["status"]) => {
    if (!selectedConsultation) return;
    setIsSubmitting(true);
    const res = await respondToConsultation(
      selectedConsultation.id,
      adminResponse,
      status,
    );
    if (res.success) {
      setSelectedConsultation(null);
      setAdminResponse("");
      fetchConsultations();
    } else {
      alert("Error: " + res.error);
    }
    setIsSubmitting(false);
  };

  const handleAddAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await addAdvisor(newAdvisor, advisorImage || undefined);
      if (res.success) {
        setIsAddingAdvisor(false);
        setNewAdvisor({
          name: "",
          specialization: "",
          bio: "",
          avatar_url: "",
        });
        setAdvisorImage(null);
        fetchAdvisors();
      } else {
        setFormError(res.error || "Failed to add advisor");
      }
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-kadin-white">
          Legal Management
        </h2>
        <div className="flex bg-kadin-light-navy p-1 rounded-lg border border-gray-700">
          <button
            onClick={() => setActiveTab("consultations")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "consultations" ? "bg-kadin-gold text-kadin-navy" : "text-kadin-slate hover:text-kadin-white"}`}
          >
            Consultations
          </button>
          <button
            onClick={() => setActiveTab("advisors")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "advisors" ? "bg-kadin-gold text-kadin-navy" : "text-kadin-slate hover:text-kadin-white"}`}
          >
            Legal Advisors
          </button>
        </div>
      </div>

      {activeTab === "consultations" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card title="All Consultations">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700 text-kadin-slate text-sm">
                      <th className="pb-3 font-semibold">User</th>
                      <th className="pb-3 font-semibold">Subject</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {consultations.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedConsultation(c)}
                        className="hover:bg-gray-800/50 cursor-pointer transition-colors"
                      >
                        <td className="py-4 text-sm text-kadin-white">
                          {c.user_name || "Unknown"}
                        </td>
                        <td className="py-4 text-sm text-kadin-white font-medium">
                          {c.subject}
                        </td>
                        <td className="py-4 text-sm text-kadin-slate">
                          {c.category}
                        </td>
                        <td className="py-4 text-sm">
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
                        </td>
                        <td className="py-4 text-sm text-kadin-slate">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {selectedConsultation ? (
              <Card title="Consultation Details">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-kadin-slate uppercase font-bold">
                      Subject
                    </label>
                    <p className="text-kadin-white font-medium">
                      {selectedConsultation.subject}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-kadin-slate uppercase font-bold">
                      Description
                    </label>
                    <p className="text-kadin-light-slate text-sm whitespace-pre-wrap">
                      {selectedConsultation.description}
                    </p>
                  </div>
                  {selectedConsultation.attachment_url && (
                    <div>
                      <label className="text-xs text-kadin-slate uppercase font-bold">
                        Attachment
                      </label>
                      <a
                        href={selectedConsultation.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-kadin-gold text-sm hover:underline"
                      >
                        View Attachment
                      </a>
                    </div>
                  )}
                  <hr className="border-gray-700" />
                  <div>
                    <label className="text-xs text-kadin-slate uppercase font-bold">
                      Admin Response
                    </label>
                    <textarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="Write your response here..."
                      className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-3 text-sm text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none mt-1 h-32"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRespond("in_progress")}
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "..." : "Mark In Progress"}
                    </button>
                    <button
                      onClick={() => handleRespond("resolved")}
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "..." : "Resolve"}
                    </button>
                  </div>
                  <button
                    onClick={() => handleRespond("rejected")}
                    disabled={isSubmitting}
                    className="w-full border border-red-500/50 text-red-500 py-2 rounded-lg text-sm font-bold hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Reject"}
                  </button>
                </div>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center p-8 bg-kadin-light-navy rounded-lg border border-dashed border-gray-700 text-kadin-slate text-center italic">
                Select a consultation to view details and respond
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddingAdvisor(true)}
              className="bg-kadin-gold text-kadin-navy px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Advisor
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisors.map((advisor) => (
              <Card key={advisor.id} title={advisor.name}>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={
                      advisor.avatar_url ||
                      "https://picsum.photos/seed/lawyer/100/100"
                    }
                    alt={advisor.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-700 object-cover"
                  />
                  <div>
                    <p className="text-sm text-kadin-gold font-bold">
                      {advisor.specialization}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-kadin-slate line-clamp-3 mb-4">
                  {advisor.bio}
                </p>
                <div className="flex justify-end gap-2">
                  <button className="text-xs text-kadin-slate hover:text-kadin-white font-bold uppercase tracking-wider">
                    Edit
                  </button>
                  <button className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider">
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Advisor Modal */}
      {isAddingAdvisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-kadin-light-navy w-full max-w-md rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-kadin-white">
                Add Legal Advisor
              </h3>
              <button
                onClick={() => setIsAddingAdvisor(false)}
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
            <form onSubmit={handleAddAdvisor} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-kadin-light-slate mb-1">
                  Name
                </label>
                <input
                  required
                  type="text"
                  disabled={isSubmitting}
                  value={newAdvisor.name}
                  onChange={(e) =>
                    setNewAdvisor({ ...newAdvisor, name: e.target.value })
                  }
                  className="w-full bg-kadin-navy border border-gray-600 rounded-lg px-4 py-2 text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-light-slate mb-1">
                  Specialization
                </label>
                <input
                  required
                  type="text"
                  disabled={isSubmitting}
                  value={newAdvisor.specialization}
                  onChange={(e) =>
                    setNewAdvisor({
                      ...newAdvisor,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full bg-kadin-navy border border-gray-600 rounded-lg px-4 py-2 text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-light-slate mb-1">
                  Bio
                </label>
                <textarea
                  required
                  disabled={isSubmitting}
                  value={newAdvisor.bio}
                  onChange={(e) =>
                    setNewAdvisor({ ...newAdvisor, bio: e.target.value })
                  }
                  className="w-full bg-kadin-navy border border-gray-600 rounded-lg px-4 py-2 text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none h-24 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-light-slate mb-1">
                  Avatar Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isSubmitting}
                  onChange={(e) => setAdvisorImage(e.target.files?.[0] || null)}
                  className="w-full text-sm text-kadin-slate file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-kadin-gold file:text-kadin-navy hover:file:bg-yellow-400 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-kadin-gold text-kadin-navy py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Advisor"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalManagement;
