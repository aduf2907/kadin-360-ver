import React, { useState, useEffect } from "react";
import { KadinEvent, Page } from "../types";

// --- Icons for this page ---
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
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
  </svg>
);
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
const ChartPieIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
    />
  </svg>
);
const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
    />
  </svg>
);
const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);
const DocumentDuplicateIcon: React.FC<{ className?: string }> = ({
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
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
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
// --- End Icons ---

const mockEvents: KadinEvent[] = [
  {
    id: 5,
    name: "KADIN Indonesia - Annual Business Forum 2025",
    date: "2025-02-10",
    location: "Grand Ballroom, KADIN Tower",
    type: "Conference",
    status: "Draft",
    registrants: 0,
    capacity: 400,
    description:
      "The flagship annual event of KADIN Indonesia, focusing on economic outlook and strategic partnerships for the coming year.",
    agenda: [],
    speakers: [],
    sponsors: [],
  },
  {
    id: 1,
    name: "Digital Transformation Summit 2024",
    date: "2024-11-15",
    location: "Jakarta Convention Center",
    type: "Conference",
    status: "Published",
    registrants: 450,
    capacity: 500,
    description:
      "A premier conference bringing together industry leaders, policymakers, and innovators to discuss the future of digital transformation in Indonesia. Featuring keynote speeches, panel discussions, and networking opportunities.",
    agenda: [
      {
        time: "09:00 - 09:30",
        title: "Registration & Welcome Coffee",
        description: "Networking and coffee.",
      },
      {
        time: "09:30 - 10:15",
        title: "Opening Keynote: Indonesia's Digital Future",
        speaker: "Budi Santoso",
        description: "Vision for a digitally empowered Indonesia.",
      },
      {
        time: "10:15 - 11:30",
        title: "Panel: AI and the Future of Work",
        speaker: "Multiple Speakers",
        description: "Discussion on AI's impact on various industries.",
      },
      {
        time: "11:30 - 12:00",
        title: "Coffee Break",
        description: "Networking session.",
      },
      {
        time: "12:00 - 13:00",
        title: "Breakout Session: Fintech Innovation",
        description: "Deep dive into financial technology trends.",
      },
    ],
    speakers: [
      {
        id: 100,
        name: "Budi Santoso",
        title: "Founder & CEO, PT. Digital Maju Bersama",
        avatar: "https://picsum.photos/100",
        bio: "Visionary entrepreneur with over 15 years of experience in the technology sector.",
      },
      {
        id: 4,
        name: "David Lee",
        title: "CTO, Innovate Solutions",
        avatar: "https://picsum.photos/id/1013/200/200",
        bio: "Technology leader specializing in SaaS platforms and AI-driven solutions.",
      },
    ],
    sponsors: [
      {
        id: 1,
        name: "Innovate Solutions",
        logoUrl: "https://picsum.photos/seed/partner4/100/100",
      },
      {
        id: 2,
        name: "FinPro Consulting",
        logoUrl: "https://picsum.photos/seed/partner2/100/100",
      },
    ],
  },
  {
    id: 2,
    name: "AI for SMEs: Practical Workshop",
    date: "2024-12-02",
    location: "Online Webinar",
    type: "Workshop",
    status: "Published",
    registrants: 120,
    capacity: 200,
    description:
      "An interactive online workshop designed to equip SME owners with practical knowledge and tools to implement AI in their business operations for increased efficiency and growth.",
    agenda: [],
    speakers: [],
    sponsors: [],
  },
  {
    id: 3,
    name: "Annual KADIN Networking Mixer",
    date: "2025-01-20",
    location: "Hotel Indonesia Kempinski",
    type: "Mixer",
    status: "Draft",
    registrants: 0,
    capacity: 300,
    description:
      "The premier networking event of the year for KADIN members. Connect with fellow entrepreneurs, industry leaders, and potential partners in a relaxed and engaging atmosphere.",
    agenda: [],
    speakers: [],
    sponsors: [],
  },
  {
    id: 4,
    name: "Indonesia-Europe Business Forum",
    date: "2024-10-28",
    location: "Online",
    type: "Conference",
    status: "Completed",
    registrants: 890,
    capacity: 1000,
    description:
      "A forum to foster trade and investment relationships between Indonesia and European nations, focusing on key sectors like renewable energy, manufacturing, and digital economy.",
    agenda: [],
    speakers: [],
    sponsors: [],
  },
];

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <div className="bg-kadin-light-navy p-5 rounded-lg border border-gray-700 flex items-center space-x-4">
    <div className="bg-kadin-navy p-3 rounded-full border border-kadin-gold/20">
      {icon}
    </div>
    <div>
      <p className="text-sm text-kadin-slate">{title}</p>
      <p className="text-2xl font-bold text-kadin-white">{value}</p>
    </div>
  </div>
);

const statusColors: { [key in KadinEvent["status"]]: string } = {
  Published: "bg-green-500/10 text-green-400",
  Draft: "bg-yellow-500/10 text-yellow-400",
  Completed: "bg-gray-500/10 text-gray-400",
};

interface EventManagementProps {
  setCurrentPage: (page: Page, payload?: any) => void;
}

const EventManagement: React.FC<EventManagementProps> = ({
  setCurrentPage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [events, setEvents] = useState<KadinEvent[]>(mockEvents);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRegistrants = events.reduce(
    (sum, event) => sum + event.registrants,
    0,
  );
  const averageAttendance = 85; // Mock data

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-kadin-white">
          Event Management
        </h2>
        <button className="bg-kadin-gold text-kadin-navy font-bold py-2 px-5 rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center">
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
          Create New Event
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Events"
          value={events.length.toString()}
          icon={<CalendarIcon className="h-8 w-8 text-kadin-gold" />}
        />
        <StatCard
          title="Total Registrants"
          value={totalRegistrants.toLocaleString()}
          icon={<UsersIcon className="h-8 w-8 text-kadin-gold" />}
        />
        <StatCard
          title="Average Attendance Rate"
          value={`${averageAttendance}%`}
          icon={<ChartPieIcon className="h-8 w-8 text-kadin-gold" />}
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-kadin-light-navy p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center flex-wrap">
        <input
          type="text"
          placeholder="Search events by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:flex-1"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="bg-kadin-light-navy rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-kadin-slate">
            <thead className="text-xs text-kadin-light-slate uppercase bg-kadin-navy">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Event Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Registrants
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-gray-700 hover:bg-kadin-navy/50 cursor-pointer"
                  onClick={() => setCurrentPage("Event Details", event)}
                >
                  <td className="px-6 py-4 font-medium text-kadin-white whitespace-nowrap">
                    {event.name}
                    <p className="text-xs text-kadin-slate font-normal">
                      {event.type} - {event.location}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[event.status]}`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-kadin-white">
                      {event.registrants.toLocaleString()}
                    </span>{" "}
                    / {event.capacity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center space-x-1">
                      <button
                        className="p-2 text-kadin-slate hover:text-kadin-gold transition-colors"
                        title="View Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPage("Event Details", event);
                        }}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-kadin-slate hover:text-kadin-gold transition-colors"
                        title="Edit Event"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Editing ${event.name}`);
                        }}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-kadin-slate hover:text-kadin-gold transition-colors"
                        title="View Analytics"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Viewing analytics for ${event.name}`);
                        }}
                      >
                        <ChartBarIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-kadin-slate hover:text-kadin-gold transition-colors"
                        title="Duplicate Event"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Duplicating ${event.name}`);
                        }}
                      >
                        <DocumentDuplicateIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredEvents.length === 0 && (
          <div className="text-center py-10 text-kadin-slate">
            <p>No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement;
