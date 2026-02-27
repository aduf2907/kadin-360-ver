import React, { useState } from "react";
import { FranchiseOpportunity } from "../types";
import { useFranchises } from "@/src/hooks/useFranchise";
import Card from "./Card";
import supabase from "@/src/supabase-client";

const FranchiseManagement: React.FC = () => {
  const {
    franchises,
    loading,
    error,
    addFranchise,
    updateFranchise,
    deleteFranchise,
  } = useFranchises();
  const [isEditing, setIsEditing] = useState(false);
  const [currentFranchise, setCurrentFranchise] =
    useState<Partial<FranchiseOpportunity> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleEdit = (franchise: FranchiseOpportunity) => {
    setCurrentFranchise(franchise);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentFranchise({
      name: "",
      category: "Food & Beverage",
      investment: "",
      imageUrl: "",
      description: "",
      location: "",
      established: "",
      outlets: "",
      contact: { name: "", email: "", phone: "" },
    });
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentFranchise) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `franchise-images/${fileName}`;

      // Upload to Supabase Storage
      // Make sure the bucket 'franchises' exists and is public
      const { error: uploadError } = await supabase.storage
        .from("franchises")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("franchises").getPublicUrl(filePath);

      setCurrentFranchise({ ...currentFranchise, imageUrl: publicUrl });
      alert("Image uploaded successfully!");
    } catch (err: any) {
      console.error("Error uploading image:", err);
      alert("Error uploading image: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this franchise?")) {
      await deleteFranchise(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFranchise) return;

    setIsSaving(true);
    let result;
    if (currentFranchise.id) {
      result = await updateFranchise(currentFranchise.id, currentFranchise);
    } else {
      result = await addFranchise(
        currentFranchise as Omit<FranchiseOpportunity, "id">,
      );
    }

    if (result.success) {
      setIsEditing(false);
      setCurrentFranchise(null);
    } else {
      alert("Error saving franchise: " + result.error);
    }
    setIsSaving(false);
  };

  if (loading && franchises.length === 0) {
    return (
      <div className="text-center py-20 text-kadin-slate">
        Loading franchises...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-kadin-white">
          Franchise Management
        </h2>
        <button
          onClick={handleAddNew}
          className="bg-kadin-gold text-kadin-navy px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
        >
          Add New Franchise
        </button>
      </div>

      {isEditing && currentFranchise && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-xl p-6 w-full max-w-2xl my-8">
            <h3 className="text-xl font-bold text-kadin-white mb-4">
              {currentFranchise.id ? "Edit Franchise" : "Add New Franchise"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentFranchise.name}
                    onChange={(e) =>
                      setCurrentFranchise({
                        ...currentFranchise,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Category
                  </label>
                  <select
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentFranchise.category}
                    onChange={(e) =>
                      setCurrentFranchise({
                        ...currentFranchise,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Retail">Retail</option>
                    <option value="Logistics & Delivery">
                      Logistics & Delivery
                    </option>
                    <option value="Healthcare & Pharmacy">
                      Healthcare & Pharmacy
                    </option>
                    <option value="Education">Education</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Investment Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IDR 200 - 500 Million"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentFranchise.investment}
                    onChange={(e) =>
                      setCurrentFranchise({
                        ...currentFranchise,
                        investment: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Brand Image
                  </label>
                  <div className="flex flex-col gap-2">
                    {currentFranchise.imageUrl && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-700 bg-kadin-navy">
                        <img
                          src={currentFranchise.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentFranchise({
                              ...currentFranchise,
                              imageUrl: "",
                            })
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
                        >
                          Remove
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
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex items-center justify-center w-full p-2 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-kadin-gold/50 transition-colors text-sm ${isUploading ? "opacity-50 cursor-not-allowed" : "text-kadin-slate"}`}
                      >
                        {isUploading
                          ? "Uploading..."
                          : currentFranchise.imageUrl
                            ? "Change Image"
                            : "Upload Brand Image"}
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Location / HQ
                  </label>
                  <input
                    type="text"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentFranchise.location}
                    onChange={(e) =>
                      setCurrentFranchise({
                        ...currentFranchise,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Established Since
                  </label>
                  <input
                    type="text"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentFranchise.established}
                    onChange={(e) =>
                      setCurrentFranchise({
                        ...currentFranchise,
                        established: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Total Outlets
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50+ Outlets"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentFranchise.outlets}
                    onChange={(e) =>
                      setCurrentFranchise({
                        ...currentFranchise,
                        outlets: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-kadin-slate mb-1">
                  Description
                </label>
                <textarea
                  className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white h-24"
                  value={currentFranchise.description}
                  onChange={(e) =>
                    setCurrentFranchise({
                      ...currentFranchise,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentFranchise.contact?.name}
                    onChange={(e) =>
                      setCurrentFranchise({
                        ...currentFranchise,
                        contact: {
                          ...currentFranchise.contact!,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentFranchise.contact?.email}
                    onChange={(e) =>
                      setCurrentFranchise({
                        ...currentFranchise,
                        contact: {
                          ...currentFranchise.contact!,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentFranchise.contact?.phone}
                    onChange={(e) =>
                      setCurrentFranchise({
                        ...currentFranchise,
                        contact: {
                          ...currentFranchise.contact!,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-700 rounded-lg text-kadin-white hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-kadin-gold text-kadin-navy rounded-lg font-bold hover:bg-yellow-400 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Franchise"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {franchises.map((franchise) => (
          <div
            key={franchise.id}
            className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={franchise.imageUrl}
                alt={franchise.name}
                className="w-12 h-12 rounded object-cover border border-gray-700"
              />
              <div>
                <h4 className="text-lg font-bold text-kadin-white">
                  {franchise.name}
                </h4>
                <p className="text-sm text-kadin-slate">
                  {franchise.category} | {franchise.investment}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(franchise)}
                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(franchise.id)}
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

export default FranchiseManagement;
