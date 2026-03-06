import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { useBonafidity } from "@/src/hooks/useBonafidity";

interface BonafiditasProps {
  user: UserProfile;
}

const statusConfig = {
  Green: {
    emoji: "🟩",
    title: "Hijau – Bonafide",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/50",
    description:
      "Your account is fully trusted and has access to all platform features.",
    privileges: [
      "Full access to AI Assistant features",
      "Priority in Business Matching engine",
      "Access to exclusive API data",
      "Eligibility for event sponsorship",
    ],
    // FIX: Added improvements property to satisfy TypeScript union type checks
    improvements: [],
  },
  Yellow: {
    emoji: "🟨",
    title: "Kuning – Perlu Verifikasi Tambahan",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/50",
    description:
      "Your account requires additional information or activity to be fully verified.",
    privileges: [
      "Access to Forums & E-Learning",
      "Limited access to Member Directory",
      "Business Matching is temporarily disabled",
      "Sponsorship opportunities are unavailable",
    ],
    improvements: [
      "Complete all legal document sections in your profile.",
      "Participate in at least three forum discussions.",
      "Attend one official KADIN event (online or offline).",
    ],
  },
  Red: {
    emoji: "🟥",
    title: "Merah – Risiko Tinggi",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/50",
    description:
      "Your account is under observation due to data anomalies or community reports.",
    privileges: [
      "Account access is limited to profile and document updates",
      "Restricted from all public events and matching engine",
      "Communication features are disabled",
    ],
    improvements: [
      "Resolve any outstanding business dispute reports.",
      "Contact KADIN Secretariat to clarify data anomalies.",
      "Provide additional references from verified members.",
    ],
  },
  Black: {
    emoji: "⬛",
    title: "Hitam – Diblokir / Nonaktif",
    color: "text-gray-500",
    bgColor: "bg-gray-700/20",
    borderColor: "border-gray-600",
    description:
      "This account has been suspended due to severe violations or failed verification.",
    privileges: [
      "All platform access is revoked.",
      "Account is placed on the national KADIN watch list.",
      "Reactivation requires a formal appeal to the ethics committee.",
    ],
    // FIX: Added improvements property to satisfy TypeScript union type checks
    improvements: [],
  },
};

const bonafidityLevels = [
  {
    ...statusConfig.Green,
    criteria: [
      "Legalitas lengkap dan terverifikasi.",
      "Aktif di forum diskusi & event KADIN.",
      "Memiliki rekam jejak transaksi yang valid.",
      "Reputasi baik di komunitas.",
      "Rating Bonafiditas ≥ 85, tanpa keluhan.",
      "Update data profil dilakukan tahunan.",
    ],
  },
  {
    ...statusConfig.Yellow,
    criteria: [
      "Ada data legalitas yang belum lengkap atau kadaluarsa.",
      "Aktivitas di platform minim atau tidak ada.",
      "Rating Bonafiditas 60–84.",
      "Belum ada riwayat transaksi yang signifikan.",
    ],
  },
  {
    ...statusConfig.Red,
    criteria: [
      "Ditemukan anomali pada data profil atau legalitas.",
      "Terdapat keluhan dari mitra bisnis.",
      "Reputasi buruk berdasarkan ulasan komunitas.",
      "Rating Bonafiditas 40–59.",
      "Memiliki 1–2 laporan sengketa bisnis yang belum terselesaikan.",
    ],
  },
  {
    ...statusConfig.Black,
    criteria: [
      "Terbukti menggunakan data palsu.",
      "Melakukan pelanggaran etik berat.",
      "Terlibat dalam fraud atau aktivitas ilegal.",
      "Sengaja memberikan informasi menyesatkan.",
      "Rating Bonafiditas < 40 atau gagal verifikasi ulang.",
    ],
  },
];

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const Bonafiditas: React.FC<BonafiditasProps> = ({ user }) => {
  const { logs, loading, fetchUserLogs } = useBonafidity();
  const [openLevel, setOpenLevel] = useState<number | null>(0); // Default to showing Green
  const status =
    statusConfig[user.bonafidityStatus as keyof typeof statusConfig] ||
    statusConfig.Yellow;

  useEffect(() => {
    if (user.id) {
      fetchUserLogs(user.id.toString());
    }
  }, [user.id]);

  const toggleLevel = (index: number) => {
    setOpenLevel(openLevel === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-kadin-white mb-2">
        User Bonafidity
      </h2>
      <p className="text-kadin-light-slate mb-8">
        Understand your trust and reputation score within the KADIN 360
        ecosystem.
      </p>

      {/* Current Status Card */}
      <div
        className={`p-6 rounded-lg border ${status.borderColor} ${status.bgColor} mb-12`}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-6xl">{status.emoji}</div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-bold uppercase tracking-wider text-kadin-slate">
              Your Current Status
            </p>
            <h3 className={`text-2xl font-bold ${status.color}`}>
              {status.title}
            </h3>
            <p className="text-kadin-slate text-sm mt-1">
              {status.description}
            </p>
          </div>
          <div className="flex-shrink-0 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-kadin-slate">
              Bonafidity Score
            </p>
            <p className={`text-4xl font-extrabold ${status.color}`}>
              {user.rating}
              <span className="text-2xl text-kadin-slate">/100</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Privileges & Limitations */}
        <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
          <h4 className="text-xl font-bold text-kadin-white mb-4">
            Your Access & Privileges
          </h4>
          <ul className="space-y-3">
            {status.privileges.map((item, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-kadin-slate">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* How to Improve */}
        {/* FIX: Check for both existence and non-empty length to ensure section only shows when actionable improvements are available */}
        {status.improvements && status.improvements.length > 0 && (
          <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
            <h4 className="text-xl font-bold text-kadin-white mb-4">
              How to Improve Your Status
            </h4>
            <ul className="space-y-3">
              {status.improvements.map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-kadin-gold"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <span className="text-kadin-slate">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bonafidity Levels Explained */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-kadin-white text-center mb-6">
          Bonafidity Levels Explained
        </h3>
        <div className="space-y-2">
          {bonafidityLevels.map((level, index) => (
            <div
              key={index}
              className={`border rounded-lg ${openLevel === index ? level.borderColor : "border-gray-700"} ${level.bgColor}`}
            >
              <button
                className="w-full flex justify-between items-center text-left p-4"
                onClick={() => toggleLevel(index)}
              >
                <span className={`font-bold text-lg ${level.color}`}>
                  {level.emoji} {level.title}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-kadin-slate transform transition-transform duration-300 ${openLevel === index ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openLevel === index ? "max-h-96" : "max-h-0"}`}
              >
                <div className="p-4 pt-0">
                  <div className="border-t border-gray-700/50 pt-4">
                    <h5 className="font-bold text-kadin-white mb-2">
                      Criteria:
                    </h5>
                    <ul className="space-y-1 list-disc list-inside text-sm text-kadin-slate">
                      {level.criteria.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <h5 className="font-bold text-kadin-white mt-4 mb-2">
                      Access Rights:
                    </h5>
                    <p className="text-sm text-kadin-slate">
                      {level.privileges.join(", ")}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bonafidity History */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-kadin-white mb-6">
          Status History
        </h3>
        <div className="bg-kadin-light-navy rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-kadin-slate italic">
              Loading history...
            </div>
          ) : logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-kadin-navy/50 text-kadin-slate text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 font-bold">Date</th>
                    <th className="px-6 py-3 font-bold">Change</th>
                    <th className="px-6 py-3 font-bold">Score</th>
                    <th className="px-6 py-3 font-bold">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {logs.map((log) => (
                    <tr key={log.id} className="text-sm">
                      <td className="px-6 py-4 text-kadin-slate">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-kadin-slate">
                            {log.old_status}
                          </span>
                          <svg
                            className="w-3 h-3 text-kadin-gold"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                          <span className="text-kadin-white font-bold">
                            {log.new_status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-kadin-slate">
                            {log.old_score}
                          </span>
                          <svg
                            className="w-3 h-3 text-kadin-gold"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                          <span className="text-kadin-white font-bold">
                            {log.new_score}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-kadin-slate italic">
                        {log.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-kadin-slate italic">
              No status changes recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bonafiditas;
