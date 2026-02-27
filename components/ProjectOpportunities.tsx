import React, { useState, useEffect, useRef } from "react";
import { ProjectOpportunity, Page } from "../types";
import { useProjectOpportunities } from "@/src/hooks/useProjectOpportunities";

const sourceColors: { [key in ProjectOpportunity["source"]]: string } = {
  Government: "bg-blue-500/10 text-blue-400",
  "World Bank": "bg-green-500/10 text-green-400",
  "Private Sector": "bg-purple-500/10 text-purple-400",
  "KADIN Initiative": "bg-kadin-gold/10 text-kadin-gold",
  "Asian Development Bank": "bg-cyan-500/10 text-cyan-400",
};

const statusColors: { [key in ProjectOpportunity["status"]]: string } = {
  "Open for Bidding": "bg-green-500 text-white",
  "In Progress": "bg-yellow-500 text-kadin-navy",
  Closed: "bg-red-600 text-white",
};

const BookmarkIcon: React.FC<{ className?: string; isSaved: boolean }> = ({
  className,
  isSaved,
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill={isSaved ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);

const ProjectCard: React.FC<{
  project: ProjectOpportunity;
  onDetailsClick: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}> = ({ project, onDetailsClick, isSaved, onToggleSave }) => (
  <div
    onClick={onDetailsClick}
    className="relative bg-kadin-light-navy rounded-lg border border-gray-700 p-6 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 hover:border-kadin-gold/50 group cursor-pointer"
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleSave();
      }}
      className="absolute top-4 right-4 z-10 p-2 bg-kadin-navy/50 rounded-full text-kadin-slate hover:text-kadin-gold transition-colors"
      aria-label="Save project"
    >
      <BookmarkIcon
        isSaved={isSaved}
        className={`h-5 w-5 ${isSaved ? "text-kadin-gold" : ""}`}
      />
    </button>
    <div className="flex justify-between items-start mb-3">
      <div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[project.status]}`}
        >
          {project.status}
        </span>
      </div>
      <span
        className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${sourceColors[project.source]}`}
      >
        {project.source}
      </span>
    </div>
    <h3 className="text-xl font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold mb-2 flex-grow-0">
      {project.title}
    </h3>

    <div className="flex flex-wrap gap-2 items-center mb-3">
      {project.sectors &&
        project.sectors.map((sector) => (
          <span
            key={sector}
            className="text-xs bg-gray-700 text-kadin-light-slate px-2 py-1 rounded-full"
          >
            {sector}
          </span>
        ))}
    </div>

    <p className="text-sm text-kadin-slate mb-4 flex-grow line-clamp-3">
      {project.description}
    </p>

    <div className="grid grid-cols-2 gap-4 text-center mt-auto pt-4 border-t border-gray-700">
      <div>
        <p className="text-xs text-kadin-slate font-semibold">PROJECT VALUE</p>
        <p className="font-bold text-kadin-white text-lg">{project.value}</p>
      </div>
      <div>
        <p className="text-xs text-kadin-slate font-semibold">DEADLINE</p>
        <p className="font-bold text-kadin-white text-lg">{project.deadline}</p>
      </div>
    </div>
    <div className="w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg text-sm group-hover:bg-yellow-400 transition-colors mt-4 text-center">
      View Details
    </div>
  </div>
);

interface ProjectOpportunitiesProps {
  setCurrentPage: (page: Page, payload?: any) => void;
}

const ProjectOpportunities: React.FC<ProjectOpportunitiesProps> = ({
  setCurrentPage,
}) => {
  const { projects, loading } = useProjectOpportunities();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [filteredProjects, setFilteredProjects] = useState<
    ProjectOpportunity[]
  >([]);
  const debounceTimeout = useRef<number | null>(null);
  // FIX: Changed Set<number> to Set<number | string> to match ProjectOpportunity id type.
  const [savedProjectIds, setSavedProjectIds] = useState<Set<number | string>>(
    new Set(),
  );
  const [activeTab, setActiveTab] = useState<"All" | "Saved">("All");

  const allSectors = [...new Set(projects.flatMap((p) => p.sectors || []))];

  // FIX: Updated handleToggleSave to accept string | number ID.
  const handleToggleSave = (projectId: number | string) => {
    setSavedProjectIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      let baseProjects = projects;

      if (activeTab === "Saved") {
        baseProjects = projects.filter((p) => savedProjectIds.has(p.id));
      }

      const filtered = baseProjects.filter((project) => {
        const matchesQuery =
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSource =
          selectedSource === "All Sources" || project.source === selectedSource;
        const matchesSector =
          selectedSector === "All Sectors" ||
          project.sectors.includes(selectedSector);

        return matchesQuery && matchesSource && matchesSector;
      });

      setFilteredProjects(filtered);
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [
    searchQuery,
    selectedSource,
    selectedSector,
    activeTab,
    savedProjectIds,
    projects,
  ]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-kadin-white mb-2">
        Project Opportunities
      </h2>
      <p className="text-kadin-light-slate mb-8">
        Discover and engage with high-value projects from government,
        international funding agencies, and the private sector.
      </p>

      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("All")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "All" ? "border-kadin-gold text-kadin-gold" : "border-transparent text-kadin-slate hover:text-kadin-white"}`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveTab("Saved")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "Saved" ? "border-kadin-gold text-kadin-gold" : "border-transparent text-kadin-slate hover:text-kadin-white"}`}
          >
            Saved Projects ({savedProjectIds.size})
          </button>
        </nav>
      </div>

      <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center flex-wrap">
        <input
          type="text"
          placeholder="Search by project title or keyword..."
          className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          <option>All Sources</option>
          <option>Government</option>
          <option>World Bank</option>
          <option>Asian Development Bank</option>
          <option>Private Sector</option>
          <option>KADIN Initiative</option>
        </select>
        <select
          className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
        >
          <option>All Sectors</option>
          {allSectors.map((sector) => (
            <option key={sector}>{sector}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-kadin-slate">
            Loading projects...
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            // FIX: ProjectCard now correctly handles string | number IDs.
            <ProjectCard
              key={project.id}
              project={project}
              onDetailsClick={() => setCurrentPage("Project Details", project)}
              isSaved={savedProjectIds.has(project.id)}
              onToggleSave={() => handleToggleSave(project.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-kadin-slate">
            <p>No project opportunities found matching your criteria.</p>
            {activeTab === "Saved" && (
              <p className="text-sm mt-2">
                You haven't saved any projects yet. Click the bookmark icon on a
                project to save it.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectOpportunities;
