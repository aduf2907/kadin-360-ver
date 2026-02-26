import React, { useState } from "react";
import { Page, KadinEvent } from "../types";
import { useEvents } from "@/src/hooks/useEvents";

interface EventsProps {
  setCurrentPage: (page: Page, payload?: any) => void;
}

const EventCard: React.FC<{ event: any; onClick: () => void }> = ({
  event,
  onClick,
}) => (
  <div
    className="bg-kadin-light-navy rounded-xl overflow-hidden border border-gray-700 flex flex-col transform hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:border-kadin-gold/50 group"
    onClick={onClick}
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={event.imageUrl || `https://picsum.photos/seed/${event.id}/800/400`}
        alt={event.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-4 right-4">
        <span className="bg-kadin-navy/80 backdrop-blur-md text-kadin-gold text-xs font-bold px-3 py-1 rounded-full border border-kadin-gold/30">
          {event.type}
        </span>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex items-center text-xs text-kadin-gold mb-2 font-semibold uppercase tracking-wider">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z"
          />
        </svg>
        {new Date(event.date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
      <h3 className="text-xl font-bold text-kadin-white mb-2 group-hover:text-kadin-gold transition-colors line-clamp-2">
        {event.name}
      </h3>
      <p className="text-sm text-kadin-slate mb-4 line-clamp-2 flex-grow">
        {event.description}
      </p>
      <div className="flex items-center text-sm text-kadin-light-slate mb-4">
        <svg
          className="w-4 h-4 mr-2 text-kadin-gold"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {event.location}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`https://picsum.photos/id/${1000 + i}/32/32`}
              className="w-8 h-8 rounded-full border-2 border-kadin-light-navy"
              alt="registrant"
            />
          ))}
          <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-kadin-light-navy flex items-center justify-center text-[10px] text-kadin-white">
            +{event.registrants > 3 ? event.registrants - 3 : 0}
          </div>
        </div>
        {/* <button
          className="text-kadin-gold text-sm font-bold hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Lihat Detail →
        </button> */}
      </div>
    </div>
  </div>
);

const Events: React.FC<EventsProps> = ({ setCurrentPage }) => {
  const { events, loading } = useEvents();
  const [filter, setFilter] = useState("All");

  const filteredEvents =
    filter === "All" ? events : events.filter((e) => e.type === filter);

  const eventTypes = ["All", ...new Set(events.map((e) => e.type))];

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-kadin-white">
            Agenda & Event
          </h2>
          <p className="text-kadin-slate">
            Temukan peluang networking dan pengetahuan di ekosistem KADIN.
          </p>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filter === type
                  ? "bg-kadin-gold text-kadin-navy"
                  : "bg-kadin-light-navy text-kadin-slate border border-gray-700 hover:border-kadin-gold/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-kadin-light-navy rounded-xl h-96 animate-pulse border border-gray-700"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => setCurrentPage("Event Details", event.id)}
            />
          ))}
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className="text-center py-20 bg-kadin-light-navy/30 rounded-xl border border-dashed border-gray-700">
          <p className="text-kadin-slate">
            Tidak ada event ditemukan untuk kategori ini.
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;
