import React, { useState } from "react";
import { ProjectOpportunity } from "../types";
import { useProjectOpportunities } from "@/src/hooks/useProjectOpportunities";
import Card from "./Card";

const ProjectManagement: React.FC = () => {
  const { projects, loading, error, addProject, updateProject, deleteProject } =
    useProjectOpportunities();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] =
    useState<Partial<ProjectOpportunity> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (project: ProjectOpportunity) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProject({
      title: "",
      source: "Private Sector",
      sectors: [],
      description: "",
      value: "",
      status: "Open for Bidding",
      deadline: "",
      requirements: [],
      eligibility: [],
      contact: { name: "", email: "", phone: "" },
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    setIsSaving(true);
    let result;
    if (currentProject.id) {
      result = await updateProject(currentProject.id, currentProject);
    } else {
      result = await addProject(
        currentProject as Omit<ProjectOpportunity, "id">,
      );
    }

    if (result.success) {
      setIsEditing(false);
      setCurrentProject(null);
    } else {
      alert("Error saving project: " + result.error);
    }
    setIsSaving(false);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="text-center py-20 text-kadin-slate">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-kadin-white">
          Project Management
        </h2>
        <button
          onClick={handleAddNew}
          className="bg-kadin-gold text-kadin-navy px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
        >
          Add New Project
        </button>
      </div>

      {isEditing && currentProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-xl p-6 w-full max-w-2xl my-8">
            <h3 className="text-xl font-bold text-kadin-white mb-4">
              {currentProject.id ? "Edit Project" : "Add New Project"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentProject.title}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Source
                  </label>
                  <select
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentProject.source}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        source: e.target.value as any,
                      })
                    }
                  >
                    <option value="Government">Government</option>
                    <option value="World Bank">World Bank</option>
                    <option value="Private Sector">Private Sector</option>
                    <option value="KADIN Initiative">KADIN Initiative</option>
                    <option value="Asian Development Bank">
                      Asian Development Bank
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentProject.value}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Status
                  </label>
                  <select
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentProject.status}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        status: e.target.value as any,
                      })
                    }
                  >
                    <option value="Open for Bidding">Open for Bidding</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentProject.deadline?.split("T")[0]}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        deadline: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-kadin-slate mb-1">
                    Relevant Sectors (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Infrastructure, Technology, Energy"
                    className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-2 text-kadin-white"
                    value={currentProject.sectors?.join(", ")}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        sectors: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s !== ""),
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
                  value={currentProject.description}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
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
                    value={currentProject.contact?.name}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        contact: {
                          ...currentProject.contact!,
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
                    value={currentProject.contact?.email}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        contact: {
                          ...currentProject.contact!,
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
                    value={currentProject.contact?.phone}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        contact: {
                          ...currentProject.contact!,
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
                  {isSaving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 flex justify-between items-center"
          >
            <div>
              <h4 className="text-lg font-bold text-kadin-white">
                {project.title}
              </h4>
              <p className="text-sm text-kadin-slate">
                {project.source} | {project.status}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(project)}
                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
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

export default ProjectManagement;
