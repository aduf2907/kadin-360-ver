import React, { useState, useEffect } from "react";
import { useBonafidity } from "@/src/hooks/useBonafidity";
import { UserProfile } from "@/types";
import Card from "./Card";

interface BonafidityManagementProps {
  user: UserProfile;
}

const BonafidityManagement: React.FC<BonafidityManagementProps> = ({
  user,
}) => {
  const {
    fetchAllUsers,
    updateUserBonafidity,
    loading: hookLoading,
  } = useBonafidity();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [newStatus, setNewStatus] = useState("Green");
  const [newScore, setNewScore] = useState(85);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSubmitting(true);
    const res = await updateUserBonafidity(
      selectedUser.id,
      newStatus,
      newScore,
      reason,
      selectedUser.bonafidity_status || "Yellow",
      selectedUser.rating || 50,
    );

    if (res.success) {
      alert("Bonafidity updated successfully!");

      // Update local state immediately for better UX
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                bonafidity_status: newStatus.toLowerCase(),
                rating: newScore,
              }
            : u,
        ),
      );

      setSelectedUser(null);
      setReason("");
      // Still reload to ensure sync with any server-side changes
      loadUsers();
    } else {
      alert("Error: " + res.error);
    }
    setIsSubmitting(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.company?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-kadin-white">
        Bonafidity Management
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card title="User List">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-kadin-navy border border-gray-700 rounded-lg px-4 py-2 text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700 text-kadin-slate text-sm">
                    <th className="pb-3 font-semibold">User / Company</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-kadin-slate italic"
                      >
                        Loading users...
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-4">
                          <div className="text-sm text-kadin-white font-medium">
                            {u.name}
                          </div>
                          <div className="text-xs text-kadin-slate">
                            {u.company}
                          </div>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              u.bonafidity_status === "green"
                                ? "bg-green-500/20 text-green-500"
                                : u.bonafidity_status === "yellow"
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : u.bonafidity_status === "red"
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-gray-500/20 text-gray-500"
                            }`}
                          >
                            {u.bonafidity_status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-kadin-white font-bold">
                          {u.rating}/100
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              const status = u.bonafidity_status || "yellow";
                              setNewStatus(
                                status.charAt(0).toUpperCase() +
                                  status.slice(1),
                              );
                              setNewScore(u.rating || 50);
                            }}
                            className="text-xs text-kadin-gold hover:text-yellow-400 font-bold uppercase tracking-wider"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {selectedUser ? (
            <Card title={`Update ${selectedUser.name}`}>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs text-kadin-slate uppercase font-bold mb-1">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg px-4 py-2 text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  >
                    <option value="Green">Green - Bonafide</option>
                    <option value="Yellow">Yellow - Needs Verification</option>
                    <option value="Red">Red - High Risk</option>
                    <option value="Black">Black - Blocked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-kadin-slate uppercase font-bold mb-1">
                    New Score (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newScore}
                    onChange={(e) => setNewScore(parseInt(e.target.value))}
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg px-4 py-2 text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-kadin-slate uppercase font-bold mb-1">
                    Reason for Change
                  </label>
                  <textarea
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why the status/score is being changed..."
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg px-4 py-2 text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none h-24 text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 border border-gray-700 text-kadin-slate py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-kadin-gold text-kadin-navy py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-8 bg-kadin-light-navy rounded-lg border border-dashed border-gray-700 text-kadin-slate text-center italic">
              Select a user from the list to update their bonafidity status
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BonafidityManagement;
