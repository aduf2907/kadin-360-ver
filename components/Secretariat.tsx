import React, { useState } from "react";
import { Page, UserProfile } from "../types";
import { useDocuments } from "@/src/hooks/useDocument";
import { useCertificateRequests } from "@/src/hooks/useCertificateRequests";
import { useActivities } from "@/src/hooks/useActivities";
import { useWorkProgramReports } from "@/src/hooks/useWorkProgramReports.ts";
import { WorkProgramReport } from "../types";

// Inline SVG Icons for simplicity
const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14"
    />
  </svg>
);

const UserEditIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const CertificateIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.334.644-.688.924-1.062a12.023 12.023 0 002.076-9.157c-.417-3.23-.97-6.22-1.996-8.83z"
    />
  </svg>
);

const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

// New Icons for added services
const DocumentManagementIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
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
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
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
      d="M17.5 17.5l2.5 2.5"
    />
  </svg>
);

const EventManagementIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 16l2 2 4-4"
    />
  </svg>
);

const ActivitiesManagementIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
);

const ReportingIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z"
    />
  </svg>
);

const EvaluationIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

interface SecretariatProps {
  setCurrentPage: (page: Page) => void;
  user: UserProfile | null;
}

const ServiceCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick?: () => void;
}> = ({ title, description, icon, buttonText, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-kadin-light-navy p-6 rounded-lg border border-gray-700 flex flex-col items-start h-full ${onClick ? "cursor-pointer hover:border-kadin-gold/50 transform hover:-translate-y-1 transition-all duration-300 group" : ""}`}
  >
    <div className="bg-kadin-navy p-3 rounded-full mb-4 border border-kadin-gold/20">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-kadin-white mb-2">{title}</h4>
    <p className="text-kadin-slate text-sm mb-4 flex-grow">{description}</p>
    <button className="mt-auto w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg text-sm group-hover:bg-yellow-400 transition-colors">
      {buttonText}
    </button>
  </div>
);

const DocumentLink: React.FC<{
  title: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
}> = ({ title, fileType, fileUrl, fileSize }) => (
  <a
    href={fileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center p-4 bg-kadin-light-navy hover:bg-kadin-navy rounded-lg border border-gray-700 transition-colors duration-200 group"
  >
    <DocumentIcon className="h-8 w-8 text-kadin-gold mr-4" />
    <div className="flex-grow">
      <h4 className="font-semibold text-kadin-white group-hover:text-kadin-gold">
        {title}
      </h4>
      <p className="text-xs text-kadin-slate">
        {fileType.split("/").pop()?.toUpperCase() || "FILE"} •{" "}
        {(fileSize / (1024 * 1024)).toFixed(2)} MB
      </p>
    </div>
    <svg
      className="w-5 h-5 text-kadin-slate group-hover:text-kadin-gold"
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
  </a>
);

const Secretariat: React.FC<SecretariatProps> = ({ setCurrentPage, user }) => {
  const { documents, loading } = useDocuments();
  const {
    requests,
    createRequest,
    loading: requestsLoading,
  } = useCertificateRequests(user?.id.toString());
  const {
    activities,
    loading: activitiesLoading,
    updateActivity,
  } = useActivities();
  const {
    reports,
    submitReport,
    updateReportStatus,
    uploadReportFile,
    loading: reportsLoading,
  } = useWorkProgramReports(user?.is_admin ? undefined : user?.id.toString());

  // Filter activities assigned to the current user that are not completed
  const myActivities = activities.filter(
    (act) =>
      act.assigned_to === user?.id.toString() && act.status !== "Completed",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "Membership Certificate",
    purpose: "",
  });
  const [reportFormData, setReportFormData] = useState({
    title: "",
    program_name: "",
    description: "",
  });
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    const result = await createRequest(
      formData.type,
      formData.purpose,
      user.id.toString(),
    );
    setIsSubmitting(false);

    if (result.success) {
      setNotification({
        message: "Request submitted successfully!",
        type: "success",
      });
      setIsModalOpen(false);
      setFormData({ type: "Membership Certificate", purpose: "" });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ message: "Error: " + result.error, type: "error" });
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    let fileUrl = "";
    if (reportFile) {
      const uploadResult = await uploadReportFile(reportFile);
      if (uploadResult.success && uploadResult.url) {
        fileUrl = uploadResult.url;
      } else {
        setNotification({
          message: "File upload failed: " + uploadResult.error,
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const result = await submitReport({
      ...reportFormData,
      report_file_url: fileUrl,
    });
    setIsSubmitting(false);

    if (result.success) {
      setNotification({
        message: "Report submitted successfully!",
        type: "success",
      });
      setIsReportModalOpen(false);
      setReportFormData({ title: "", program_name: "", description: "" });
      setReportFile(null);
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ message: "Error: " + result.error, type: "error" });
    }
  };

  const handleReportStatusUpdate = async (
    id: string,
    status: WorkProgramReport["status"],
  ) => {
    const feedback =
      status === "Revision Required"
        ? prompt("Enter feedback for revision:")
        : undefined;
    if (status === "Revision Required" && feedback === null) return;

    setIsSubmitting(true);
    const result = await updateReportStatus(id, status, feedback || undefined);
    setIsSubmitting(false);

    if (result.success) {
      setNotification({
        message: `Report ${status.toLowerCase()} successfully!`,
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ message: "Error: " + result.error, type: "error" });
    }
  };

  return (
    <div className="relative">
      <h2 className="text-3xl font-bold text-kadin-white mb-2">
        KADIN Secretariat
      </h2>
      <p className="text-kadin-light-slate mb-8">
        Your central hub for all administrative needs. Manage your membership,
        access important documents, and find support.
      </p>

      {/* Member Services Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-kadin-white mb-4 border-b border-gray-700 pb-2">
          Member Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard
            title="Membership Renewal"
            description="Easily renew your annual KADIN membership to maintain access to all benefits and features."
            icon={<RefreshIcon className="h-8 w-8 text-kadin-gold" />}
            buttonText="Renew Now"
            onClick={() => setCurrentPage("Upgrade")}
          />
          <ServiceCard
            title="Update Profile Data"
            description="Keep your business and personal information up-to-date to ensure you get the most relevant connections."
            icon={<UserEditIcon className="h-8 w-8 text-kadin-gold" />}
            buttonText="Go to Profile"
            onClick={() => setCurrentPage("Profile")}
          />
          <ServiceCard
            title="Certificate Request"
            description="Request official certificates of membership or participation for your business needs."
            icon={<CertificateIcon className="h-8 w-8 text-kadin-gold" />}
            buttonText="Request Certificate"
            onClick={() => setIsModalOpen(true)}
          />
          <ServiceCard
            title="Document Management"
            description="Manage and archive important organizational documents, circulars, and official letters securely."
            icon={
              <DocumentManagementIcon className="h-8 w-8 text-kadin-gold" />
            }
            buttonText="Open Document Hub"
            onClick={() => setCurrentPage("Document Hub")}
          />
          <ServiceCard
            title="Event Management"
            description="A comprehensive tool for planning, executing, and managing registrations for KADIN events and webinars."
            icon={<EventManagementIcon className="h-8 w-8 text-kadin-gold" />}
            buttonText="Manage Events"
          />
          <ServiceCard
            title="Activities Management"
            description="Track and coordinate ongoing member activities, committee tasks, and cross-departmental projects."
            icon={
              <ActivitiesManagementIcon className="h-8 w-8 text-kadin-gold" />
            }
            buttonText="View Activities"
            onClick={() => setCurrentPage("Activities Management")}
          />
          <ServiceCard
            title="Work Program Reporting"
            description="Submit, monitor, and review the progress of work programs and initiatives from various departments."
            icon={<ReportingIcon className="h-8 w-8 text-kadin-gold" />}
            buttonText="Submit Report"
            onClick={() => setIsReportModalOpen(true)}
          />
          <ServiceCard
            title="Evaluation System"
            description="Evaluate the effectiveness and impact of completed programs and activities with our integrated system."
            icon={<EvaluationIcon className="h-8 w-8 text-kadin-gold" />}
            buttonText="Start Evaluation"
          />
        </div>
      </div>

      {/* Document Center Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-kadin-white mb-4 border-b border-gray-700 pb-2">
          Document Center
        </h3>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-kadin-light-navy animate-pulse rounded-lg border border-gray-700"
              ></div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center bg-kadin-light-navy rounded-lg border border-gray-700">
            <p className="text-kadin-slate">
              No documents available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.slice(0, 6).map((doc) => (
              <DocumentLink
                key={doc.id}
                title={doc.title}
                fileType={doc.file_type}
                fileUrl={doc.file_url}
                fileSize={doc.file_size}
              />
            ))}
          </div>
        )}
        {documents.length > 6 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setCurrentPage("Document Hub")}
              className="text-kadin-gold hover:text-yellow-400 font-semibold transition-colors"
            >
              View All Documents
            </button>
          </div>
        )}
      </div>

      {/* My Requests Section */}
      {requests.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-kadin-white mb-4 border-b border-gray-700 pb-2">
            My Certificate Requests
          </h3>
          <div className="bg-kadin-light-navy rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full text-sm text-left text-kadin-slate">
              <thead className="text-xs text-kadin-light-slate uppercase bg-kadin-navy">
                <tr>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-kadin-navy/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-kadin-white">
                      {req.type}
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
                    <td className="px-6 py-4">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === "approved" && req.certificate_url ? (
                        <a
                          href={req.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-kadin-gold hover:underline font-bold"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-600 italic">Processing</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* My Activities Section */}
      {myActivities.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <h3 className="text-2xl font-bold text-kadin-white">
              My Activities
            </h3>
            <button
              onClick={() => setCurrentPage("Activities Management")}
              className="text-kadin-gold text-sm hover:underline"
            >
              Manage All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-kadin-white line-clamp-1">
                    {activity.title}
                  </h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      activity.priority === "High"
                        ? "bg-red-500/20 text-red-500"
                        : activity.priority === "Medium"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    {activity.priority}
                  </span>
                </div>
                <p className="text-xs text-kadin-slate mb-4 line-clamp-2 flex-grow">
                  {activity.description}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <select
                    value={activity.status}
                    onChange={(e) =>
                      updateActivity(activity.id, {
                        status: e.target.value as any,
                      })
                    }
                    className="bg-kadin-navy border border-gray-700 rounded p-1 text-[10px] text-kadin-slate outline-none"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                  <span className="text-[10px] text-kadin-light-slate italic">
                    Due:{" "}
                    {activity.due_date
                      ? new Date(activity.due_date).toLocaleDateString()
                      : "No date"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Program Reports Section */}
      {reports.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-kadin-white mb-4 border-b border-gray-700 pb-2">
            Work Program Reports
          </h3>
          <div className="bg-kadin-light-navy rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full text-sm text-left text-kadin-slate">
              <thead className="text-xs text-kadin-light-slate uppercase bg-kadin-navy">
                <tr>
                  <th className="px-6 py-3">Program / Title</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Submitted By</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {reports.map((rep) => (
                  <tr
                    key={rep.id}
                    className="hover:bg-kadin-navy/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-kadin-white">
                        {rep.program_name}
                      </div>
                      <div className="text-xs text-kadin-slate">
                        {rep.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          rep.status === "Approved"
                            ? "bg-green-500/20 text-green-500"
                            : rep.status === "Revision Required"
                              ? "bg-red-500/20 text-red-500"
                              : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {rep.status}
                      </span>
                      {rep.feedback && (
                        <p className="text-[10px] mt-1 text-red-400 italic">
                          "{rep.feedback}"
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">{rep.user_name || "Unknown"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {rep.report_file_url && (
                          <a
                            href={rep.report_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-kadin-gold hover:underline font-bold text-xs bg-kadin-navy px-2 py-1 rounded border border-gray-700"
                          >
                            View
                          </a>
                        )}
                        {user?.is_admin && rep.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleReportStatusUpdate(rep.id, "Approved")
                              }
                              className="text-green-500 hover:underline font-bold text-xs bg-kadin-navy px-2 py-1 rounded border border-gray-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleReportStatusUpdate(
                                  rep.id,
                                  "Revision Required",
                                )
                              }
                              className="text-red-500 hover:underline font-bold text-xs bg-kadin-navy px-2 py-1 rounded border border-gray-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contact & Support Section */}
      <div>
        <h3 className="text-2xl font-bold text-kadin-white mb-4 border-b border-gray-700 pb-2">
          Contact & Support
        </h3>
        <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <PhoneIcon className="h-8 w-8 text-kadin-gold mt-1 mr-4" />
            <div>
              <h4 className="font-bold text-kadin-white">Membership Support</h4>
              <p className="text-sm text-kadin-slate">
                For questions about your membership status, renewals, or
                benefits.
              </p>
              <a
                href="mailto:membership@kadin360.id"
                className="text-sm text-kadin-gold hover:underline mt-1 block"
              >
                membership@kadin360.id
              </a>
            </div>
          </div>
          <div className="flex items-start">
            <PhoneIcon className="h-8 w-8 text-kadin-gold mt-1 mr-4" />
            <div>
              <h4 className="font-bold text-kadin-white">Event Inquiries</h4>
              <p className="text-sm text-kadin-slate">
                For information on upcoming events, registration, and
                sponsorships.
              </p>
              <a
                href="mailto:events@kadin360.id"
                className="text-sm text-kadin-gold hover:underline mt-1 block"
              >
                events@kadin3.id
              </a>
            </div>
          </div>
          <div className="flex items-start">
            <PhoneIcon className="h-8 w-8 text-kadin-gold mt-1 mr-4" />
            <div>
              <h4 className="font-bold text-kadin-white">General Inquiries</h4>
              <p className="text-sm text-kadin-slate">
                For all other questions or support needs.
              </p>
              <a
                href="mailto:info@kadin360.id"
                className="text-sm text-kadin-gold hover:underline mt-1 block"
              >
                info@kadin360.id
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Request Certificate
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Certificate Type
                </label>
                <select
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="Membership Certificate">
                    Membership Certificate (KTA)
                  </option>
                  <option value="Certificate of Participation">
                    Certificate of Participation
                  </option>
                  <option value="Letter of Good Standing">
                    Letter of Good Standing
                  </option>
                  <option value="Business Recommendation">
                    Business Recommendation
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Purpose / Description
                </label>
                <textarea
                  required
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none h-32 resize-none"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  placeholder="Explain why you need this certificate..."
                />
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
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-1 bg-kadin-gold text-kadin-navy font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-2xl p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold text-white mb-4">
              Submit Work Program Report
            </h3>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Program Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  value={reportFormData.program_name}
                  onChange={(e) =>
                    setReportFormData({
                      ...reportFormData,
                      program_name: e.target.value,
                    })
                  }
                  placeholder="e.g. UMKM Digitalization 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Report Title
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none"
                  value={reportFormData.title}
                  onChange={(e) =>
                    setReportFormData({
                      ...reportFormData,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Monthly Progress Report - October"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Description / Summary
                </label>
                <textarea
                  required
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none h-24 resize-none"
                  value={reportFormData.description}
                  onChange={(e) =>
                    setReportFormData({
                      ...reportFormData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Report File (PDF/Doc)
                </label>
                <input
                  required
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full bg-kadin-navy border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-kadin-gold outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-kadin-gold file:text-kadin-navy hover:file:bg-yellow-400"
                  onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                />
                <p className="text-[10px] text-kadin-slate mt-1">
                  Upload your report file directly.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-1 bg-kadin-gold text-kadin-navy font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
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
    </div>
  );
};

export default Secretariat;
