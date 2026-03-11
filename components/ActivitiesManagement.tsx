import React, { useState, useEffect } from "react";
import { Activity, UserProfile } from "../types";
import { useActivities } from "@/src/hooks/useActivities";
import supabase from "@/src/supabase-client";

const priorityConfig = {
  High: { color: "bg-red-500", label: "High" },
  Medium: { color: "bg-yellow-500", label: "Medium" },
  Low: { color: "bg-blue-500", label: "Low" },
};

const columnConfig: {
  [key in Activity["status"]]: { title: string; color: string };
} = {
  Todo: { title: "To Do", color: "border-gray-500" },
  "In Progress": { title: "In Progress", color: "border-blue-500" },
  Completed: { title: "Completed", color: "border-green-500" },
  "On Hold": { title: "On Hold", color: "border-yellow-500" },
};

const ActivityCard: React.FC<{
  activity: Activity;
  onUpdate: (id: string, status: Activity["status"]) => void;
}> = ({ activity, onUpdate }) => {
  const isOverdue =
    activity.due_date &&
    new Date(activity.due_date) < new Date() &&
    activity.status !== "Completed";
  const priority = priorityConfig[activity.priority];

  return (
    <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-4 hover:shadow-lg hover:border-kadin-gold/50 transition-all duration-200">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-kadin-white pr-2">{activity.title}</h4>
        <div
          className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${priority.color}`}
          title={`Priority: ${priority.label}`}
        ></div>
      </div>
      <p className="text-xs text-kadin-slate mt-2 line-clamp-2">
        {activity.description}
      </p>

      <div className="mt-3">
        <select
          value={activity.status}
          onChange={(e) =>
            onUpdate(activity.id, e.target.value as Activity["status"])
          }
          className="w-full bg-kadin-navy border border-gray-700 rounded p-1 text-[10px] text-kadin-slate outline-none focus:ring-1 focus:ring-kadin-gold"
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-700/50">
        <div className="flex items-center">
          <img
            src={
              (activity as any).assignee_avatar || "https://picsum.photos/200"
            }
            alt={activity.assignee_name}
            className="w-6 h-6 rounded-full mr-2 border-2 border-gray-600"
          />
          <span className="text-xs font-semibold text-kadin-light-slate truncate max-w-[80px]">
            {activity.assignee_name || "Unassigned"}
          </span>
        </div>
        {activity.due_date && (
          <div
            className={`text-xs font-semibold px-2 py-1 rounded ${isOverdue ? "bg-red-500/20 text-red-400" : "bg-gray-700 text-kadin-slate"}`}
          >
            {new Date(activity.due_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const BoardColumn: React.FC<{
  status: Activity["status"];
  activities: Activity[];
  onUpdate: (id: string, status: Activity["status"]) => void;
}> = ({ status, activities, onUpdate }) => {
  const config = columnConfig[status];
  return (
    <div className="bg-kadin-navy/50 rounded-lg p-3 w-full min-h-[400px]">
      <h3
        className={`font-bold text-kadin-white border-b-4 pb-2 mb-4 ${config.color} flex justify-between`}
      >
        <span>{config.title}</span>
        <span className="bg-gray-700 text-kadin-light-slate text-sm font-semibold rounded-full px-2">
          {activities.length}
        </span>
      </h3>
      <div className="space-y-4 h-[calc(100vh-25rem)] overflow-y-auto pr-2 custom-scrollbar">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

const ActivitiesManagement: React.FC = () => {
  const {
    activities,
    loading,
    error,
    createActivity,
    updateActivity,
    refresh,
  } = useActivities();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    department: "",
    priority: "Medium" as Activity["priority"],
    due_date: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("users").select("id, name, avatar");
      if (data) setUsers(data as any);
    };
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createActivity(formData);
    if (result.success) {
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        assigned_to: "",
        department: "",
        priority: "Medium",
        due_date: "",
      });
    } else {
      alert("Error: " + result.error);
    }
  };

  const handleStatusUpdate = async (id: string, status: Activity["status"]) => {
    await updateActivity(id, { status });
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      (activity.title?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (activity.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      );
    const matchesPriority =
      filterPriority === "All" || activity.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const activitiesByStatus = {
    Todo: filteredActivities.filter((a) => a.status === "Todo"),
    "In Progress": filteredActivities.filter((a) => a.status === "In Progress"),
    Completed: filteredActivities.filter((a) => a.status === "Completed"),
    "On Hold": filteredActivities.filter((a) => a.status === "On Hold"),
  };

  if (loading)
    return (
      <div className="p-8 text-center text-kadin-gold">
        Loading activities...
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex justify-between items-center">
          <span>
            <strong>Error:</strong> {error}
          </span>
          <button
            onClick={() => refresh()}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-kadin-white">
            Activities Management
          </h2>
          <p className="text-kadin-slate text-sm">
            Track and coordinate organizational tasks and projects.
            {activities.length > 0 && (
              <span className="ml-2 text-kadin-gold font-semibold">
                ({activities.length} total activities)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-kadin-gold text-kadin-navy font-bold py-2 px-5 rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Activity
        </button>
      </div>

      {/* Filters */}
      <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center flex-wrap">
        <input
          type="text"
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:flex-1"
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          onClick={() => refresh()}
          className="text-kadin-gold text-sm hover:underline"
        >
          Refresh
        </button>
      </div>

      {/* Kanban Board */}
      {filteredActivities.length === 0 && !loading ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-kadin-light-navy/30 rounded-2xl border border-dashed border-gray-700 p-12">
          <div className="bg-kadin-navy p-4 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-kadin-slate"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-kadin-white mb-2">
            No Activities Found
          </h3>
          <p className="text-kadin-slate text-center max-w-md">
            {searchTerm || filterPriority !== "All"
              ? "No activities match your current search or filter criteria. Try adjusting them."
              : "There are no activities recorded yet. Click 'New Activity' to create one."}
          </p>
          {(searchTerm || filterPriority !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterPriority("All");
              }}
              className="mt-4 text-kadin-gold hover:underline font-semibold"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
          {Object.keys(activitiesByStatus).map((status) => (
            <BoardColumn
              key={status}
              status={status as Activity["status"]}
              activities={activitiesByStatus[status as Activity["status"]]}
              onUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-2xl p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold text-white mb-6">
              Create New Activity
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Title
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Description
                </label>
                <textarea
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none h-24 resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-kadin-slate mb-1">
                    Assign To
                  </label>
                  <select
                    className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                    value={formData.assigned_to}
                    onChange={(e) =>
                      setFormData({ ...formData, assigned_to: e.target.value })
                    }
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-kadin-slate mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as any,
                      })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-kadin-slate mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IT, Legal"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-kadin-slate mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                    value={formData.due_date}
                    onChange={(e) =>
                      setFormData({ ...formData, due_date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-kadin-gold text-kadin-navy font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  Create Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesManagement;
