import React, { useState } from "react";
import { useStories } from "@/src/hooks/useStories";
import { StoryEntry } from "../types";

const StoryManagement: React.FC = () => {
  const { entries, loading, updateEntryStatus, deleteEntry } =
    useStories(false); // Show all entries
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [selectedEntry, setSelectedEntry] = useState<StoryEntry | null>(null);

  const filteredEntries = entries.filter((entry) => {
    if (filterStatus === "all") return true;
    return entry.status === filterStatus;
  });

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected",
  ) => {
    if (confirm(`Are you sure you want to ${status} this entry?`)) {
      const result = await updateEntryStatus(id, status);
      if (!result.success) {
        alert("Error: " + result.error);
      } else {
        if (selectedEntry && selectedEntry.id === id) {
          setSelectedEntry({ ...selectedEntry, status });
        }
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this entry permanently?")) {
      const result = await deleteEntry(id);
      if (!result.success) {
        alert("Error: " + result.error);
      } else {
        if (selectedEntry && selectedEntry.id === id) {
          setSelectedEntry(null);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-kadin-white">
          Story Management
        </h2>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterStatus === status ? "bg-kadin-gold text-kadin-navy" : "bg-kadin-light-navy text-kadin-slate hover:text-kadin-white"}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {filteredEntries.length > 0 ? (
        <div className="bg-kadin-light-navy rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-kadin-navy border-b border-gray-700">
                <th className="p-4 text-xs font-bold text-kadin-slate uppercase tracking-wider">
                  Entry
                </th>
                <th className="p-4 text-xs font-bold text-kadin-slate uppercase tracking-wider">
                  Author
                </th>
                <th className="p-4 text-xs font-bold text-kadin-slate uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-xs font-bold text-kadin-slate uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-kadin-slate uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-kadin-navy/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={entry.image_url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-gray-700 shadow-sm"
                      />
                      <div className="max-w-xs">
                        <p className="text-sm font-bold text-kadin-white group-hover:text-kadin-gold transition-colors truncate">
                          {entry.title}
                        </p>
                        <p className="text-xs text-kadin-slate truncate">
                          {entry.content}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={entry.author_avatar}
                        alt=""
                        className="w-6 h-6 rounded-full border border-gray-600"
                      />
                      <span className="text-sm text-kadin-white">
                        {entry.author_name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-gray-700/50 text-kadin-light-slate px-2.5 py-1 rounded-full border border-gray-600">
                      {entry.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                        entry.status === "approved"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : entry.status === "rejected"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div
                      className="flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {entry.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(entry.id, "approved")
                            }
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/40 transition-all"
                            title="Approve"
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(entry.id, "rejected")
                            }
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-all"
                            title="Reject"
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
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 bg-gray-700/50 text-kadin-slate rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all border border-gray-600"
                        title="Delete"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-20 bg-kadin-light-navy/30 rounded-2xl border border-dashed border-gray-700">
            <p className="text-kadin-slate">No story entries found.</p>
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
                  Story Review
                </h3>
                <p className="text-xs text-kadin-slate mt-1">
                  Submitted on{" "}
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
                <h4 className="text-2xl font-bold text-kadin-white leading-tight">
                  {selectedEntry.title}
                </h4>

                <div className="flex items-center gap-3 py-3 border-y border-gray-700/50">
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
                  <div className="ml-auto">
                    <span
                      className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                        selectedEntry.status === "approved"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : selectedEntry.status === "rejected"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}
                    >
                      Status: {selectedEntry.status}
                    </span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-kadin-light-slate leading-relaxed whitespace-pre-wrap">
                    {selectedEntry.content}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-between items-center bg-kadin-navy/50">
              <button
                onClick={() => handleDelete(selectedEntry.id)}
                className="px-6 py-2.5 bg-gray-700 text-kadin-slate rounded-xl font-bold hover:bg-red-500/20 hover:text-red-400 transition-all border border-gray-600"
              >
                Delete Permanently
              </button>

              <div className="flex gap-3">
                {selectedEntry.status === "pending" ? (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedEntry.id, "rejected")
                      }
                      className="px-6 py-2.5 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/40 transition-all border border-red-500/20"
                    >
                      Reject Submission
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedEntry.id, "approved")
                      }
                      className="px-8 py-2.5 bg-kadin-gold text-kadin-navy rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-kadin-gold/20"
                    >
                      Approve & Publish
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="px-8 py-2.5 bg-kadin-gold text-kadin-navy rounded-xl font-bold hover:bg-yellow-400 transition-all"
                  >
                    Close Preview
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryManagement;
