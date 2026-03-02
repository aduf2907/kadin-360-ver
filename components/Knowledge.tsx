import React, { useState } from "react";
import { KnowledgeEntry, UserProfile } from "../types";
import { useKnowledge } from "@/src/hooks/useKnowledge";
import supabase from "@/src/supabase-client";

// Icons
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const KnowledgeCard: React.FC<{
  entry: KnowledgeEntry;
  onClick: () => void;
}> = ({ entry, onClick }) => (
  <div
    onClick={onClick}
    className="bg-kadin-light-navy rounded-xl overflow-hidden border border-gray-700 hover:border-kadin-gold/50 transition-all group flex flex-col h-full shadow-lg cursor-pointer"
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={entry.image_url}
        alt={entry.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-3 left-3">
        <span className="bg-kadin-navy/80 backdrop-blur-md text-kadin-gold text-[10px] font-bold px-2.5 py-1 rounded-full border border-kadin-gold/20 uppercase tracking-wider">
          {entry.category}
        </span>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-lg font-bold text-kadin-white mb-2 group-hover:text-kadin-gold transition-colors line-clamp-2">
        {entry.title}
      </h3>
      <p className="text-sm text-kadin-slate line-clamp-3 mb-4 flex-1">
        {entry.content}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 mt-auto">
        <div className="flex items-center gap-2">
          <img
            src={entry.author_avatar}
            alt={entry.author_name}
            className="w-6 h-6 rounded-full border border-gray-600"
          />
          <span className="text-xs text-kadin-slate font-medium">
            {entry.author_name}
          </span>
        </div>
        <span className="text-[10px] text-kadin-slate/60">
          {new Date(entry.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>
);

const Knowledge: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { entries, loading, addEntry } = useKnowledge(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [newEntry, setNewEntry] = useState({
    title: "",
    category: "Article",
    content: "",
    image_url: "",
  });

  const categories = [
    "All",
    "Article",
    "E-Learning",
    "Whitepaper",
    "Regulation",
    "Case Study",
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `knowledge/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("knowledge")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("knowledge").getPublicUrl(filePath);

      setNewEntry((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.title || !newEntry.content) return;

    setIsSaving(true);
    const result = await addEntry({
      ...newEntry,
      author_id: user.id.toString(),
    });

    if (result.success) {
      setIsModalOpen(false);
      setNewEntry({
        title: "",
        category: "Article",
        content: "",
        image_url: "",
      });
      alert(
        "Knowledge submitted successfully! It will be visible after admin approval.",
      );
    } else {
      alert("Failed to submit knowledge: " + result.error);
    }
    setIsSaving(false);
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-kadin-white">
            Knowledge & Learning
          </h2>
          <p className="text-kadin-slate mt-1">
            Access verified business insights, regulations, and learning
            materials.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-kadin-gold text-kadin-navy font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-kadin-gold/10"
        >
          <PlusIcon className="w-5 h-5" />
          Share Knowledge
        </button>
      </div>

      <div className="bg-kadin-light-navy/50 p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label
            htmlFor="search-knowledge"
            className="block text-xs font-bold text-kadin-slate uppercase mb-2 ml-1"
          >
            Search Knowledge
          </label>
          <input
            id="search-knowledge"
            type="text"
            placeholder="Search by title or content..."
            className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-3 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <label
            htmlFor="category-filter"
            className="block text-xs font-bold text-kadin-slate uppercase mb-2 ml-1"
          >
            Category
          </label>
          <select
            id="category-filter"
            className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-3 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all text-sm"
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
      </div>

      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <KnowledgeCard
              key={entry.id}
              entry={entry}
              onClick={() => setSelectedEntry(entry)}
            />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-20 bg-kadin-light-navy/30 rounded-2xl border border-dashed border-gray-700">
            <p className="text-kadin-slate">
              No knowledge entries found matching your criteria.
            </p>
          </div>
        )
      )}

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-kadin-navy/50">
              <div>
                <h3 className="text-xl font-bold text-kadin-white">
                  {selectedEntry.title}
                </h3>
                <p className="text-xs text-kadin-slate mt-1">
                  Published on{" "}
                  {new Date(selectedEntry.created_at).toLocaleDateString()} by{" "}
                  {selectedEntry.author_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-kadin-slate hover:text-kadin-white transition-colors p-2 hover:bg-gray-700 rounded-full"
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

            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
              <div className="relative h-64 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                <img
                  src={selectedEntry.image_url}
                  alt={selectedEntry.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-kadin-navy/80 backdrop-blur-md text-kadin-gold text-xs font-bold px-3 py-1.5 rounded-full border border-kadin-gold/20 uppercase tracking-widest">
                    {selectedEntry.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 py-3 border-b border-gray-700/50">
                  <img
                    src={selectedEntry.author_avatar}
                    alt=""
                    className="w-10 h-10 rounded-full border border-gray-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-kadin-white">
                      {selectedEntry.author_name}
                    </p>
                    <p className="text-xs text-kadin-slate">Contributor</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-kadin-light-slate leading-relaxed whitespace-pre-wrap text-lg">
                    {selectedEntry.content}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end bg-kadin-navy/50">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-8 py-2.5 bg-kadin-gold text-kadin-navy rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-kadin-gold/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-kadin-white">
                Share Your Knowledge
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
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
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-kadin-slate mb-1.5"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    placeholder="Enter a descriptive title"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all"
                    value={newEntry.title}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, title: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-kadin-slate mb-1.5"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all"
                      value={newEntry.category}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, category: e.target.value })
                      }
                    >
                      {categories
                        .filter((c) => c !== "All")
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-kadin-slate mb-1.5">
                      Cover Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                        id="knowledge-image"
                      />
                      <label
                        htmlFor="knowledge-image"
                        className={`flex items-center justify-center w-full p-2.5 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-kadin-gold/50 hover:bg-kadin-gold/5 transition-all text-sm ${isUploading ? "opacity-50 cursor-not-allowed" : "text-kadin-slate"}`}
                      >
                        {isUploading
                          ? "Uploading..."
                          : newEntry.image_url
                            ? "Change Image"
                            : "Upload Image"}
                      </label>
                    </div>
                  </div>
                </div>

                {newEntry.image_url && (
                  <div className="relative h-40 rounded-lg overflow-hidden border border-gray-700">
                    <img
                      src={newEntry.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setNewEntry({ ...newEntry, image_url: "" })
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-kadin-slate mb-1.5"
                  >
                    Content / Summary
                  </label>
                  <textarea
                    id="content"
                    required
                    placeholder="Share the key insights or summary of this knowledge..."
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2.5 text-kadin-white h-40 focus:border-kadin-gold focus:ring-1 focus:ring-kadin-gold outline-none transition-all resize-none"
                    value={newEntry.content}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, content: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-700 flex justify-end gap-3 bg-kadin-light-navy">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-700 rounded-lg text-kadin-white hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-6 py-2.5 bg-kadin-gold text-kadin-navy rounded-lg font-bold hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-lg shadow-kadin-gold/10"
                >
                  {isSaving ? "Submitting..." : "Submit for Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Knowledge;
