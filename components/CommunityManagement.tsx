import React, { useEffect, useState } from "react";
import { useCommunityGroups } from "@/src/hooks/useCommunityGroups";
import { UserProfile, CommunityGroup } from "../types";

interface CommunityManagementProps {
  user: UserProfile;
}

const CommunityManagement: React.FC<CommunityManagementProps> = ({ user }) => {
  const { groups, loading, approveGroup, deleteGroup, fetchAllGroups } =
    useCommunityGroups();
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(
    null,
  );

  useEffect(() => {
    if (user?.is_admin) {
      fetchAllGroups();
    }
  }, [user]);

  const handleApprove = async (id: string) => {
    if (window.confirm("Are you sure you want to approve this group?")) {
      const result = await approveGroup(id);
      if (result.success) {
        fetchAllGroups();
      } else {
        alert("Error: " + result.error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to reject/delete this group?")) {
      const result = await deleteGroup(id);
      if (result.success) {
        fetchAllGroups();
      } else {
        alert("Error: " + result.error);
      }
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-kadin-white">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-kadin-slate mt-2">
          Only administrators can access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-kadin-white">
          Community Management
        </h2>
        <p className="text-kadin-slate mt-1">
          Review and manage community group proposals.
        </p>
      </div>

      <div className="bg-kadin-light-navy rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-kadin-navy text-kadin-slate text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Group Info</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date Submitted</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
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
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-kadin-slate"
                  >
                    No group proposals found.
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr
                    key={group.id}
                    className="hover:bg-kadin-navy/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedGroup(group)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            group.image_url ||
                            "https://picsum.photos/seed/group/100/100"
                          }
                          alt={group.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-700"
                        />
                        <div>
                          <div className="text-kadin-white font-medium">
                            {group.name}
                          </div>
                          <div className="text-xs text-kadin-slate line-clamp-1">
                            {group.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-kadin-gold bg-kadin-gold/10 px-2 py-1 rounded-full">
                        {group.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {group.is_approved ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Approved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-kadin-slate">
                      {new Date(group.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className="flex justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!group.is_approved && (
                          <button
                            onClick={() => handleApprove(group.id)}
                            className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                            title="Approve Group"
                          >
                            <svg
                              className="w-5 h-5"
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
                        )}
                        <button
                          onClick={() => handleDelete(group.id)}
                          className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                          title="Reject/Delete Group"
                        >
                          <svg
                            className="w-5 h-5"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="relative h-48 sm:h-64">
              <img
                src={
                  selectedGroup.image_url ||
                  "https://picsum.photos/seed/group/800/400"
                }
                alt={selectedGroup.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kadin-light-navy via-transparent to-transparent"></div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-md"
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

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-xs font-bold text-kadin-gold bg-kadin-gold/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedGroup.category}
                </span>
                {selectedGroup.is_approved ? (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    Approved
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    Pending Approval
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-kadin-white mb-4">
                {selectedGroup.name}
              </h3>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="text-sm font-semibold text-kadin-slate uppercase tracking-wider mb-2">
                    Description
                  </h4>
                  <p className="text-kadin-light-slate leading-relaxed">
                    {selectedGroup.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <h4 className="text-xs font-semibold text-kadin-slate uppercase tracking-wider mb-1">
                      Submitted By
                    </h4>
                    <p className="text-kadin-white text-sm font-medium">
                      User ID: {selectedGroup.created_by}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-kadin-slate uppercase tracking-wider mb-1">
                      Date Submitted
                    </h4>
                    <p className="text-kadin-white text-sm font-medium">
                      {new Date(selectedGroup.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {!selectedGroup.is_approved && (
                  <button
                    onClick={() => {
                      handleApprove(selectedGroup.id);
                      setSelectedGroup(null);
                    }}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
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
                    Approve Group
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDelete(selectedGroup.id);
                    setSelectedGroup(null);
                  }}
                  className={`flex-1 font-bold py-3 rounded-xl transition-all border ${
                    selectedGroup.is_approved
                      ? "bg-rose-500 hover:bg-rose-600 text-white border-transparent"
                      : "bg-transparent hover:bg-rose-500/10 text-rose-400 border-rose-500/30"
                  } flex items-center justify-center gap-2`}
                >
                  <svg
                    className="w-5 h-5"
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
                  {selectedGroup.is_approved
                    ? "Delete Group"
                    : "Reject Proposal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityManagement;
