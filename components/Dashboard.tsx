import React, { useState, useEffect } from "react";
import Card from "./Card";
import { NewsArticle, Page, UserProfile, ActivityEvent } from "../types";
import NewsIcon from "./icons/NewsIcon";
import { generateDashboardInsights } from "../services/geminiService";
import ChatbotIcon from "./icons/ChatbotIcon";
import { useNews } from "@/src/hooks/useNews";
import { useEvents } from "@/src/hooks/useEvents";

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M9 5l7 7-7 7"
    />
  </svg>
);

// Inline icons for stats
const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const ClipboardListIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);
const HandshakeIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.148-6.353a1.76 1.76 0 013.417-.592z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.5 5.882V19.24a1.76 1.76 0 003.417.592l2.148-6.353a1.76 1.76 0 00-3.417-.592z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.5 13.5h15"
    />
  </svg>
);
const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);
const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

// New icons for activity log
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

const CursorClickIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 8.188a9 9 0 1110.624 10.624M12 12a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const stats = [
  {
    label: "Jumlah Member",
    value: "1,250",
    icon: <UsersIcon className="h-8 w-8 text-kadin-gold" />,
  },
  {
    label: "Jumlah Mitra",
    value: "340",
    icon: <BriefcaseIcon className="h-8 w-8 text-kadin-gold" />,
  },
  {
    label: "Jumlah Project",
    value: "89",
    icon: <ClipboardListIcon className="h-8 w-8 text-kadin-gold" />,
  },
  {
    label: "Jumlah Kerjasama",
    value: "152",
    icon: <HandshakeIcon className="h-8 w-8 text-kadin-gold" />,
  },
  {
    label: "Jumlah Peluang Bisnis",
    value: "218",
    icon: <LightbulbIcon className="h-8 w-8 text-kadin-gold" />,
  },
  {
    label: "Nilai Value Bisnis",
    value: "IDR 5.7 T",
    icon: <TrendingUpIcon className="h-8 w-8 text-kadin-gold" />,
  },
];

const StatCard: React.FC<{
  stat: { label: string; value: string; icon: React.ReactNode };
}> = ({ stat }) => (
  <div className="bg-kadin-light-navy p-5 rounded-lg border border-gray-700 flex items-center space-x-4">
    <div className="bg-kadin-navy p-3 rounded-full border border-kadin-gold/20">
      {stat.icon}
    </div>
    <div>
      <p className="text-sm text-kadin-slate">{stat.label}</p>
      <p className="text-2xl font-bold text-kadin-white">{stat.value}</p>
    </div>
  </div>
);

const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: "KADIN Partners with Government on New Digital Economy Initiative",
    category: "Press Release",
    summary: "",
    date: "Oct 25, 2024",
  },
  {
    id: 2,
    title: "Market Update: Manufacturing Sector Shows 5% Growth in Q3",
    category: "Market Insight",
    summary: "",
    date: "Oct 22, 2024",
  },
  {
    id: 3,
    title: "Registration Open for the Annual KADIN National Conference 2024",
    category: "Event",
    summary: "",
    date: "Oct 20, 2024",
  },
];

interface DashboardProps {
  setCurrentPage: (page: Page) => void;
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage, user }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);
  const { news } = useNews(3);
  const { events } = useEvents(3);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoadingInsights(true);
        setError(null);
        const generatedInsights = await generateDashboardInsights(user);
        setInsights(generatedInsights);
      } catch (e) {
        setError("Failed to load AI insights. Please try again later.");
        console.error(e);
      } finally {
        setIsLoadingInsights(false);
      }
    };

    fetchInsights();

    const loadActivityLog = () => {
      try {
        const log = localStorage.getItem("kadin360-user-activity");
        if (log) {
          setActivityLog(JSON.parse(log));
        }
      } catch (error) {
        console.error("Failed to load or parse activity log:", error);
      }
    };

    loadActivityLog();
  }, [user]);

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds} seconds ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  const ActivityLogItem: React.FC<{ event: ActivityEvent }> = ({ event }) => {
    const getIcon = () => {
      switch (event.type) {
        case "page_view":
          return <EyeIcon className="h-5 w-5 text-blue-400" />;
        case "action":
          return <CursorClickIcon className="h-5 w-5 text-green-400" />;
        case "chatbot_interaction":
          return <ChatbotIcon className="h-5 w-5 text-purple-400" />;
        default:
          return <div className="h-5 w-5" />;
      }
    };

    const getText = () => {
      const payloadText = event.payload.replace(/_/g, " ");
      switch (event.type) {
        case "page_view":
          return (
            <>
              <span className="font-semibold text-kadin-white">
                Viewed page:
              </span>{" "}
              {payloadText}
            </>
          );
        case "action":
          return (
            <>
              <span className="font-semibold text-kadin-white">
                Performed action:
              </span>{" "}
              <span className="capitalize">{payloadText}</span>
            </>
          );
        case "chatbot_interaction":
          return (
            <>
              <span className="font-semibold text-kadin-white">
                Used chatbot:
              </span>{" "}
              <span className="capitalize">{payloadText}</span>
            </>
          );
        default:
          return payloadText;
      }
    };

    return (
      <div className="flex items-start space-x-3 py-3">
        <div className="flex-shrink-0 pt-1">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-sm text-kadin-light-slate">{getText()}</p>
          <p className="text-xs text-kadin-slate">
            {formatTimeAgo(event.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-kadin-white mb-6">Dashboard</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-4">
          <Card title="AI-Powered Personal Insights">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-kadin-navy p-3 rounded-full border border-kadin-gold/20 mt-1">
                <LightbulbIcon className="h-6 w-6 text-kadin-gold" />
              </div>
              <div className="flex-1">
                <p className="text-kadin-slate text-sm mb-3">
                  Based on your profile, here are a few suggestions to get the
                  most out of KADIN 360:
                </p>
                {isLoadingInsights ? (
                  <div className="flex items-center text-kadin-slate">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                    <span>
                      Generating personalized recommendations for you...
                    </span>
                  </div>
                ) : error ? (
                  <p className="text-red-400">{error}</p>
                ) : (
                  <ul className="space-y-2">
                    {insights.map((insight, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <ChevronRightIcon className="h-5 w-5 text-kadin-gold flex-shrink-0 mr-2" />
                        <span className="text-kadin-light-slate">
                          {insight}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Card>
        </div>

        <Card title="Upcoming Events" onClick={() => setCurrentPage("Events")}>
          {events.length === 0 ? (
            <p className="text-sm text-kadin-slate italic">
              Belum ada event selanjutnya.
            </p>
          ) : (
            <ul className="space-y-3">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span>{event.title}</span>
                  <span className="font-semibold text-kadin-light-slate">
                    {event.date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="New Messages"
          onClick={() => setCurrentPage("Communication")}
        >
          <ul className="space-y-3">
            <li className="flex items-center text-sm">
              <img
                src="https://picsum.photos/id/1027/50/50"
                className="h-8 w-8 rounded-full mr-3"
                alt="sender"
              />
              <div className="flex-1">
                <p className="font-semibold text-kadin-white">Andi Wijaya</p>
                <p className="text-xs text-kadin-slate truncate">
                  Sure, let's connect next week...
                </p>
              </div>
            </li>
            <li className="flex items-center text-sm">
              <img
                src="https://picsum.photos/id/1011/50/50"
                className="h-8 w-8 rounded-full mr-3"
                alt="sender"
              />
              <div className="flex-1">
                <p className="font-semibold text-kadin-white">Citra Lestari</p>
                <p className="text-xs text-kadin-slate truncate">
                  Here is the proposal you requested.
                </p>
              </div>
            </li>
          </ul>
        </Card>

        <Card
          title="Learning Progress"
          onClick={() => setCurrentPage("Knowledge")}
        >
          <div className="space-y-3">
            <p className="text-sm">Export Strategy Masterclass</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-kadin-gold h-2.5 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-right text-xs">75% Complete</p>
          </div>
        </Card>

        <Card
          title="AI Recommended Partners"
          onClick={() => setCurrentPage("Matching")}
        >
          <ul className="space-y-3">
            <li className="flex items-center text-sm">
              <img
                src="https://picsum.photos/id/1012/50/50"
                className="h-8 w-8 rounded-full mr-3"
                alt="partner"
              />
              <div>
                <p className="font-semibold text-kadin-white">
                  PT. Maju Logistik
                </p>
                <p className="text-xs text-kadin-slate">Technology | Jakarta</p>
              </div>
            </li>
            <li className="flex items-center text-sm">
              <img
                src="https://picsum.photos/id/1013/50/50"
                className="h-8 w-8 rounded-full mr-3"
                alt="partner"
              />
              <div>
                <p className="font-semibold text-kadin-white">
                  Agro Makmur Sejahtera
                </p>
                <p className="text-xs text-kadin-slate">
                  Agriculture | Surabaya
                </p>
              </div>
            </li>
          </ul>
        </Card>

        <div className="md:col-span-2">
          <Card title="KADIN News" onClick={() => setCurrentPage("News")}>
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-1">
                    <NewsIcon className="h-5 w-5 text-kadin-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-kadin-white hover:text-kadin-gold cursor-pointer text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-kadin-slate">
                      {item.category} -{" "}
                      {new Date(item.published_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card
            title="Recent Forum Discussions"
            onClick={() => setCurrentPage("KADINers Rooms")}
          >
            <div className="divide-y divide-gray-700">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-kadin-white hover:text-kadin-gold cursor-pointer">
                    Regulatory Update: New Export Tax Policy
                  </h4>
                  <p className="text-sm text-kadin-slate">
                    Posted in 'Investment & Policy' by Rina Hartono
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-kadin-slate" />
              </div>
              <div className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-kadin-white hover:text-kadin-gold cursor-pointer">
                    Opportunities in Renewable Energy Sector
                  </h4>
                  <p className="text-sm text-kadin-slate">
                    Posted in 'Energy & Resources' by Admin
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-kadin-slate" />
              </div>
            </div>
          </Card>
        </div>

        {/* <div className="md:col-span-2 lg:col-span-4">
                    <Card title="Recent Activity">
                        {activityLog.length > 0 ? (
                            <div className="max-h-80 overflow-y-auto divide-y divide-gray-700/50 pr-2">
                                {activityLog.map((event, index) => (
                                    <ActivityLogItem key={index} event={event} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-kadin-slate text-sm">No recent activity recorded.</p>
                        )}
                    </Card>
                </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
