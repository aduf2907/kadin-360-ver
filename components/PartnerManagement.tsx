import React, { useState } from "react";
import { KadinPartner } from "../types";
import { useKadinPartners } from "@/src/hooks/useKadinPartners";
import supabase from "@/src/supabase-client";

const PartnerManagement: React.FC = () => {
  const { partners, loading, error, addPartner, updatePartner, deletePartner } =
    useKadinPartners();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPartner, setCurrentPartner] =
    useState<Partial<KadinPartner> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [servicesInput, setServicesInput] = useState("");
  const [industriesInput, setIndustriesInput] = useState("");

  const handleEdit = (partner: KadinPartner) => {
    setCurrentPartner(partner);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentPartner({
      name: "",
      category: "Strategic Partner",
      logoUrl: "",
      description: "",
      offer: "",
      about: "",
      services: [],
      targetIndustries: [],
      contact: { email: "", phone: "", website: "" },
    });
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentPartner) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `partner-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("partners")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("partners").getPublicUrl(filePath);

      setCurrentPartner({ ...currentPartner, logoUrl: publicUrl });
    } catch (err: any) {
      console.error("Error uploading logo:", err);
      alert("Error uploading logo: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      await deletePartner(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedPartner = {
      ...currentPartner,
      services: servicesInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
      targetIndustries: industriesInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
    };

    if (!currentPartner) return;

    setIsSaving(true);
    let result;
    if (currentPartner.id) {
      result = await updatePartner(currentPartner.id, currentPartner);
    } else {
      result = await addPartner(currentPartner as Omit<KadinPartner, "id">);
    }

    if (result.success) {
      setIsEditing(false);
      setCurrentPartner(null);
    } else {
      alert("Error saving partner: " + result.error);
    }
    setIsSaving(false);
  };

  if (loading && partners.length === 0) {
    return (
      <div className="text-center py-20 text-kadin-slate">
        Loading partners...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-kadin-white">
          Partner Management
        </h2>
        <button
          onClick={handleAddNew}
          className="bg-kadin-gold text-kadin-navy px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
        >
          Add New Partner
        </button>
      </div>

      {isEditing && currentPartner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-kadin-white">
                {currentPartner.id ? "Edit Partner" : "Add New Partner"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-kadin-slate hover:text-kadin-white transition-colors"
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
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="partner-name"
                        className="block text-sm font-medium text-kadin-slate mb-1.5"
                      >
                        Partner Name
                      </label>
                      <input
                        id="partner-name"
                        type="text"
                        required
                        placeholder="Enter partner name"
                        className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all"
                        value={currentPartner.name}
                        onChange={(e) =>
                          setCurrentPartner({
                            ...currentPartner,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="partner-category"
                        className="block text-sm font-medium text-kadin-slate mb-1.5"
                      >
                        Category
                      </label>
                      <select
                        id="partner-category"
                        className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all"
                        value={currentPartner.category}
                        onChange={(e) =>
                          setCurrentPartner({
                            ...currentPartner,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="Strategic Partner">
                          Strategic Partner
                        </option>
                        <option value="Technology Partner">
                          Technology Partner
                        </option>
                        <option value="Financial Partner">
                          Financial Partner
                        </option>
                        <option value="Logistics Partner">
                          Logistics Partner
                        </option>
                        <option value="Government Agency">
                          Government Agency
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-kadin-slate mb-1.5">
                        Partner Logo
                      </label>
                      <div className="flex flex-col gap-3">
                        {currentPartner.logoUrl && (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-700 bg-white p-2">
                            <img
                              src={currentPartner.logoUrl}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentPartner({
                                  ...currentPartner,
                                  logoUrl: "",
                                })
                              }
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 shadow-lg"
                            >
                              &times;
                            </button>
                          </div>
                        )}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            className={`flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-kadin-gold/50 hover:bg-kadin-gold/5 transition-all text-sm ${isUploading ? "opacity-50 cursor-not-allowed" : "text-kadin-slate"}`}
                          >
                            {isUploading ? (
                              <span className="flex items-center gap-2">
                                <svg
                                  className="animate-spin h-4 w-4 text-kadin-gold"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Uploading...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                  />
                                </svg>
                                {currentPartner.logoUrl
                                  ? "Change Logo"
                                  : "Upload Logo"}
                              </span>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-kadin-slate mb-1.5"
                      >
                        Contact Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="partner@example.com"
                        className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all"
                        value={currentPartner.contact?.email}
                        onChange={(e) =>
                          setCurrentPartner({
                            ...currentPartner,
                            contact: {
                              ...currentPartner.contact!,
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-sm font-medium text-kadin-slate mb-1.5"
                      >
                        Contact Phone
                      </label>
                      <input
                        id="contact-phone"
                        type="text"
                        placeholder="+62 ..."
                        className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all"
                        value={currentPartner.contact?.phone}
                        onChange={(e) =>
                          setCurrentPartner({
                            ...currentPartner,
                            contact: {
                              ...currentPartner.contact!,
                              phone: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-website"
                        className="block text-sm font-medium text-kadin-slate mb-1.5"
                      >
                        Website
                      </label>
                      <input
                        id="contact-website"
                        type="text"
                        placeholder="https://..."
                        className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all"
                        value={currentPartner.contact?.website}
                        onChange={(e) =>
                          setCurrentPartner({
                            ...currentPartner,
                            contact: {
                              ...currentPartner.contact!,
                              website: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="short-desc"
                    className="block text-sm font-medium text-kadin-slate mb-1.5"
                  >
                    Short Description
                  </label>
                  <input
                    id="short-desc"
                    type="text"
                    placeholder="Brief summary of the partner"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all"
                    value={currentPartner.description}
                    onChange={(e) =>
                      setCurrentPartner({
                        ...currentPartner,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="exclusive-offer"
                    className="block text-sm font-medium text-kadin-slate mb-1.5"
                  >
                    Exclusive Offer for Members
                  </label>
                  <input
                    id="exclusive-offer"
                    type="text"
                    placeholder="e.g. 20% Discount for KADIN Members"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all"
                    value={currentPartner.offer}
                    onChange={(e) =>
                      setCurrentPartner({
                        ...currentPartner,
                        offer: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="about-partner"
                    className="block text-sm font-medium text-kadin-slate mb-1.5"
                  >
                    About Partner
                  </label>
                  <textarea
                    id="about-partner"
                    placeholder="Detailed information about the partner's background and mission"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white h-32 focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all resize-none"
                    value={currentPartner.about}
                    onChange={(e) =>
                      setCurrentPartner({
                        ...currentPartner,
                        about: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="partner-services"
                      className="block text-sm font-medium text-kadin-slate mb-1.5"
                    >
                      Services (comma-separated)
                    </label>
                    <textarea
                      id="partner-services"
                      placeholder="Service 1, Service 2, Service 3"
                      className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white h-24 focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all resize-none"
                      value={servicesInput}
                      onChange={(e) => setServicesInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="target-industries"
                      className="block text-sm font-medium text-kadin-slate mb-1.5"
                    >
                      Target Industries (comma-separated)
                    </label>
                    <textarea
                      id="target-industries"
                      placeholder="Industry 1, Industry 2, Industry 3"
                      className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white h-24 focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all resize-none"
                      value={industriesInput}
                      onChange={(e) => setIndustriesInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-700 flex justify-end gap-3 bg-kadin-light-navy">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 border border-gray-700 rounded-lg text-kadin-white hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-kadin-gold text-kadin-navy rounded-lg font-bold hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-lg shadow-kadin-gold/10"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Partner"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-white p-1 border border-gray-700">
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-kadin-white">
                  {partner.name}
                </h4>
                <p className="text-sm text-kadin-slate">
                  {partner.category} | {partner.contact.website}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(partner)}
                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(partner.id)}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerManagement;
