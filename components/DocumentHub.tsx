import React, { useState, useRef } from "react";
import { UserProfile } from "../types";
import { useDocuments } from "@/src/hooks/useDocument";

// Icons for the page
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);
const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);
const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const categoryColors: { [key: string]: string } = {
  Circular: "bg-blue-500/10 text-blue-400",
  "Official Letter": "bg-yellow-500/10 text-yellow-400",
  Report: "bg-green-500/10 text-green-400",
  Guideline: "bg-purple-500/10 text-purple-400",
};

interface DocumentHubProps {
  user: UserProfile | null;
}

const DocumentHub: React.FC<DocumentHubProps> = ({ user }) => {
  const { documents, loading, refresh } = useDocuments();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description &&
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      filterCategory === "All" || doc.file_type.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-kadin-white mb-2">Document Hub</h2>
      <p className="text-kadin-light-slate mb-8">
        Search, view, and download all important KADIN Secretariat documents
        from one secure location.
      </p>

      <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center flex-wrap">
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:flex-1"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
        >
          <option value="All">All Types</option>
          <option value="PDF">PDF</option>
          <option value="DOC">Word</option>
          <option value="XLS">Excel</option>
        </select>

        {user?.is_admin && (
          <div className="text-xs text-kadin-gold font-medium">
            Admin Mode: Use Document Management to upload/delete
          </div>
        )}
      </div>

      <div className="bg-kadin-light-navy rounded-lg border border-gray-700 overflow-hidden">
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-kadin-slate">
              <thead className="text-xs text-kadin-light-slate uppercase bg-kadin-navy">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Document Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date Uploaded
                  </th>
                  <th scope="col" className="px-6 py-3">
                    File Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-gray-700 hover:bg-kadin-navy/50"
                  >
                    <td className="px-6 py-4 font-medium text-kadin-white whitespace-nowrap flex items-center">
                      <FileIcon className="h-5 w-5 mr-3 text-kadin-slate" />
                      {doc.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400`}
                      >
                        {doc.file_type.split("/").pop()?.toUpperCase() ||
                          "FILE"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {(doc.file_size / (1024 * 1024)).toFixed(2)} MB
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-kadin-slate hover:text-kadin-gold transition-colors"
                          title="View"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </a>
                        <a
                          href={doc.file_url}
                          download
                          className="p-2 text-kadin-slate hover:text-kadin-gold transition-colors"
                          title="Download"
                        >
                          <DownloadIcon className="h-5 w-5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredDocuments.length === 0 && (
          <div className="text-center py-10 text-kadin-slate">
            <p>No documents found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentHub;
