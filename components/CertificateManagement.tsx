import React, { useState } from "react";
import { useCertificateRequests } from "@/src/hooks/useCertificateRequests";
import supabase from "@/src/supabase-client";

const CertificateManagement: React.FC = () => {
  const { requests, loading, error, updateRequestStatus, refresh } =
    useCertificateRequests();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected",
    certificateUrl?: string,
  ) => {
    setIsProcessing(id);
    const result = await updateRequestStatus(
      id,
      status,
      certificateUrl,
      adminNotes[id],
    );
    setIsProcessing(null);

    if (result.success) {
      // Success notification could be added here
    } else {
      alert("Error updating request: " + result.error);
    }
  };

  const handleFileUpload = async (id: string, file: File) => {
    try {
      setUploadingFile(id);
      const fileExt = file.name.split(".").pop();
      const fileName = `certificates/${id}_${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(fileName);

      await handleStatusUpdate(id, "approved", publicUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Error uploading certificate: " + err.message);
    } finally {
      setUploadingFile(null);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-kadin-gold">Loading requests...</div>
    );
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Certificate Management
          </h2>
          <p className="text-kadin-slate">
            Review and process member certificate requests.
          </p>
        </div>
        <button
          onClick={() => refresh()}
          className="bg-kadin-navy border border-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
        >
          Refresh List
        </button>
      </div>

      <div className="bg-kadin-light-navy rounded-2xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-kadin-navy text-kadin-light-slate text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Member</th>
              <th className="px-6 py-4 font-bold">Request Type</th>
              <th className="px-6 py-4 font-bold">Purpose</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-kadin-slate italic"
                >
                  No certificate requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-kadin-navy/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">
                      {req.user_name || "Unknown User"}
                    </div>
                    <div className="text-[10px] text-kadin-slate uppercase">
                      {req.user_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-kadin-white">{req.type}</td>
                  <td className="px-6 py-4">
                    <p
                      className="text-sm text-kadin-slate max-w-xs truncate"
                      title={req.purpose}
                    >
                      {req.purpose}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        req.status === "approved"
                          ? "bg-green-500/20 text-green-500"
                          : req.status === "rejected"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-kadin-slate text-sm">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === "pending" ? (
                      <div className="flex flex-col gap-2 items-end">
                        <textarea
                          placeholder="Admin notes..."
                          className="bg-kadin-navy border border-gray-700 rounded-lg p-2 text-xs text-white w-48 h-16 resize-none"
                          value={adminNotes[req.id] || ""}
                          onChange={(e) =>
                            setAdminNotes({
                              ...adminNotes,
                              [req.id]: e.target.value,
                            })
                          }
                        />
                        <div className="flex gap-2">
                          <button
                            disabled={isProcessing === req.id}
                            onClick={() =>
                              handleStatusUpdate(req.id, "rejected")
                            }
                            className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <label
                            className={`bg-kadin-gold text-kadin-navy px-3 py-1 rounded-lg text-xs font-bold cursor-pointer hover:bg-yellow-400 transition-colors ${uploadingFile === req.id ? "opacity-50 pointer-events-none" : ""}`}
                          >
                            {uploadingFile === req.id
                              ? "Uploading..."
                              : "Approve & Upload"}
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(req.id, file);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-kadin-slate italic">
                        Processed on{" "}
                        {new Date(
                          req.updated_at || req.created_at,
                        ).toLocaleDateString()}
                        {req.certificate_url && (
                          <a
                            href={req.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-kadin-gold hover:underline mt-1 font-bold"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CertificateManagement;
