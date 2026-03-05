import React, { useState, useRef } from "react";
import { CommunityGroup, CommunityEvent, UserProfile } from "../types";
import { useCommunityGroups } from "@/src/hooks/useCommunityGroups";

interface CommunityProps {
  user: UserProfile;
}

const GroupCard: React.FC<{ group: CommunityGroup }> = ({ group }) => (
  <div
    className="bg-kadin-light-navy rounded-lg overflow-hidden border border-gray-700 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer hover:border-kadin-gold/50 group"
    onClick={() => alert(`Navigating to group: ${group.name}`)}
  >
    <img
      src={group.image_url || "https://picsum.photos/seed/group/400/200"}
      alt={group.name}
      className="w-full h-40 object-cover"
    />
    <div className="p-4 flex flex-col flex-grow">
      <span className="text-xs font-semibold text-kadin-gold bg-kadin-gold/10 px-2 py-1 rounded-full self-start">
        {group.category}
      </span>
      <h3 className="text-lg font-bold mt-2 text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">
        {group.name}
      </h3>
      <p className="text-sm mt-2 text-kadin-slate flex-grow">
        {group.description}
      </p>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center text-sm text-kadin-light-slate">
          <svg
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          {(group.member_count || 0).toLocaleString()} members
        </div>
        <button
          className="bg-kadin-gold text-kadin-navy font-bold py-2 px-4 rounded-lg text-sm hover:bg-yellow-400 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Join Group
        </button>
      </div>
    </div>
  </div>
);

const EventCard: React.FC<{ event: CommunityEvent }> = ({ event }) => (
  <div
    className="bg-kadin-light-navy rounded-lg overflow-hidden border border-gray-700 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer hover:border-kadin-gold/50 group"
    onClick={() => alert(`Navigating to event: ${event.title}`)}
  >
    <img
      src={event.imageUrl}
      alt={event.title}
      className="w-full h-32 object-cover"
    />
    <div className="p-4 flex flex-col flex-grow">
      <h4 className="font-bold text-kadin-white flex-grow transition-colors duration-200 group-hover:text-kadin-gold">
        {event.title}
      </h4>
      <p className="text-xs text-kadin-gold mt-1">{event.group}</p>
      <div className="text-sm text-kadin-slate mt-4 space-y-2">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          {event.date}
        </div>
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {event.location}
        </div>
      </div>
      <button
        className="mt-4 w-full border border-kadin-gold text-kadin-gold font-semibold py-2 rounded-lg text-sm hover:bg-kadin-gold hover:text-kadin-navy transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        View Details
      </button>
    </div>
  </div>
);

const Community: React.FC<CommunityProps> = ({ user }) => {
  const { groups, loading, addGroup, refresh } = useCommunityGroups();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: "Technology",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const result = await addGroup(
        {
          ...newGroup,
          created_by: user.id.toString(),
        },
        selectedFile || undefined,
      );

      if (result.success) {
        alert(
          "Group submitted successfully! It will be visible once approved by an admin.",
        );
        setShowAddModal(false);
        setNewGroup({ name: "", description: "", category: "Technology" });
        setSelectedFile(null);
        setPreviewUrl(null);
        refresh();
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-kadin-white">Community Hub</h2>
          <p className="text-kadin-slate mt-1">
            Connect with industry peers and join interest-based groups.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-kadin-gold text-kadin-navy font-bold py-2.5 px-6 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-kadin-gold/20"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Group
        </button>
      </div>

      <div className="bg-kadin-light-navy/50 p-4 rounded-lg border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search groups or events..."
          className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full"
        />
        <select className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto">
          <option>All Categories</option>
          <option>Technology</option>
          <option>Agriculture</option>
          <option>Trade</option>
          <option>Manufacturing</option>
          <option>Energy</option>
        </select>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-kadin-white mb-4">
          Featured Groups
        </h3>
        {loading ? (
          <div className="flex justify-center py-12">
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.length > 0 ? (
              groups.map((group) => <GroupCard key={group.id} group={group} />)
            ) : (
              <div className="col-span-full text-center py-12 bg-kadin-light-navy/30 rounded-2xl border border-dashed border-gray-700">
                <p className="text-kadin-slate">
                  No approved groups available yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Group Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-kadin-navy border border-gray-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-kadin-light-navy/50">
              <h3 className="text-xl font-bold text-kadin-white">
                Propose New Group
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-kadin-slate hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Group Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-kadin-light-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  placeholder="e.g. Jakarta Tech Founders"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Category
                </label>
                <select
                  className="w-full bg-kadin-light-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  value={newGroup.category}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, category: e.target.value })
                  }
                >
                  <option>Technology</option>
                  <option>Agriculture</option>
                  <option>Trade</option>
                  <option>Manufacturing</option>
                  <option>Energy</option>
                  <option>F&B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-kadin-light-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  placeholder="What is this group about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Group Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-xl hover:border-kadin-gold/50 cursor-pointer transition-colors bg-kadin-light-navy/30"
                >
                  {previewUrl ? (
                    <div className="relative w-full h-32">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                        <p className="text-white text-xs font-bold">
                          Change Image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-kadin-slate"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <div className="flex text-sm text-kadin-slate">
                        <span className="relative cursor-pointer rounded-md font-medium text-kadin-gold hover:text-yellow-400">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-kadin-slate">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-kadin-gold text-kadin-navy font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-kadin-navy"
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
                      Submitting...
                    </>
                  ) : (
                    "Submit for Approval"
                  )}
                </button>
                <p className="text-[10px] text-center text-kadin-slate mt-3 italic">
                  *Your group will be reviewed by KADIN admins before it becomes
                  public.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
