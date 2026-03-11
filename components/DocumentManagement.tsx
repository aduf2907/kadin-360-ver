import React, { useState, useRef } from "react";
import { UserProfile } from "../types";
import { useDocuments } from "@/src/hooks/useDocument";

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

interface DocumentManagementProps {
  user: UserProfile | null;
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({ user }) => {
  const { documents, loading, uploadDocument, deleteDocument, refresh } =
    useDocuments();
  const [isUploading, setIsUploading] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    category: "Circular",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      const result = await uploadDocument(
        selectedFile,
        newDoc.title,
        newDoc.description,
        user.id.toString(),
      );
      if (result.success) {
        setNotification({
          message: "Document uploaded successfully!",
          type: "success",
        });
        setNewDoc({ title: "", description: "", category: "Circular" });
        setSelectedFile(null);
        refresh();
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ message: "Error: " + result.error, type: "error" });
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p className="text-kadin-slate mt-2">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-kadin-white mb-2">
          Document Management
        </h2>
        <p className="text-kadin-light-slate">
          Upload and manage official documents for the KADIN 360 Document Hub.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-700 bg-kadin-navy/30">
              <h3 className="text-xl font-bold text-kadin-white flex items-center">
                <UploadIcon className="h-5 w-5 mr-2 text-kadin-gold" />
                Upload New Document
              </h3>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Document Title
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  value={newDoc.title}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, title: e.target.value })
                  }
                  placeholder="e.g. Annual Report 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Description
                </label>
                <textarea
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none h-24 resize-none"
                  value={newDoc.description}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, description: e.target.value })
                  }
                  placeholder="Brief description of the document..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Category (Internal Label)
                </label>
                <select
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  value={newDoc.category}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, category: e.target.value })
                  }
                >
                  <option value="Circular">Circular</option>
                  <option value="Official Letter">Official Letter</option>
                  <option value="Report">Report</option>
                  <option value="Guideline">Guideline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  File
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-xl hover:border-kadin-gold/50 cursor-pointer transition-colors bg-kadin-navy/30"
                >
                  <div className="space-y-1 text-center">
                    <FileIcon className="mx-auto h-12 w-12 text-kadin-slate" />
                    <div className="flex text-sm text-kadin-slate">
                      <span className="relative cursor-pointer rounded-md font-medium text-kadin-gold hover:text-yellow-400">
                        {selectedFile ? selectedFile.name : "Upload a file"}
                      </span>
                    </div>
                    <p className="text-xs text-kadin-slate">
                      PDF, DOCX, XLSX up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  disabled={isUploading || !selectedFile}
                  type="submit"
                  className="w-full bg-kadin-gold text-kadin-navy font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isUploading ? (
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
                      Uploading...
                    </>
                  ) : (
                    "Upload Document"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Document List */}
        <div className="lg:col-span-2">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-700 bg-kadin-navy/30 flex justify-between items-center">
              <h3 className="text-xl font-bold text-kadin-white">
                Existing Documents
              </h3>
              <button
                onClick={refresh}
                className="text-kadin-gold hover:text-yellow-400 text-sm font-medium"
              >
                Refresh List
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-kadin-slate">
                <thead className="text-xs text-kadin-light-slate uppercase bg-kadin-navy">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">File Name</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <svg
                          className="animate-spin h-8 w-8 text-kadin-gold mx-auto"
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
                      </td>
                    </tr>
                  ) : documents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-kadin-slate"
                      >
                        No documents uploaded yet.
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-kadin-navy/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-kadin-white">
                          {doc.title}
                        </td>
                        <td className="px-6 py-4 text-xs">{doc.file_name}</td>
                        <td className="px-6 py-4">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                id: doc.id,
                                url: doc.file_url,
                              })
                            }
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-2xl z-50 animate-bounce ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-kadin-slate mb-8">
              Are you sure you want to delete this document? This action cannot
              be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const result = await deleteDocument(
                    deleteConfirm.id,
                    deleteConfirm.url,
                  );
                  if (result.success) {
                    setNotification({
                      message: "Document deleted successfully",
                      type: "success",
                    });
                    setTimeout(() => setNotification(null), 3000);
                  } else {
                    setNotification({
                      message: "Error deleting document",
                      type: "error",
                    });
                  }
                  setDeleteConfirm(null);
                  refresh();
                }}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;
