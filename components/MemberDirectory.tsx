import React, { useState, useEffect, useRef } from "react";
import { UserProfile, Page } from "../types";
import VerifiedIcon from "./icons/VerifiedIcon";
import { useMembers } from "@/src/hooks/useMember";
import { useMessages } from "@/src/hooks/useMessage";

/**
 * Calculates the Levenshtein distance between two strings.
 * This is a measure of the difference between two sequences.
 */
const levenshteinDistance = (s1: string, s2: string): number => {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1].toLowerCase() === s2[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }
  return dp[m][n];
};

/**
 * Performs a fuzzy search to check if a query matches a text.
 * It splits the query into tokens and checks if each token has a fuzzy match in the text.
 * @param query The search string.
 * @param text The text to search within.
 * @returns True if it's a match, false otherwise.
 */
const fuzzySearch = (query: string, text: string): boolean => {
  const queryTokens = query
    .toLowerCase()
    .split(" ")
    .filter((t) => t);
  if (queryTokens.length === 0) return true;

  const textTokens = text.toLowerCase().split(/[\s,.\-_]+/);

  return queryTokens.every((qToken) => {
    return textTokens.some((tToken) => {
      // Allow more distance for longer words to be more forgiving.
      // e.g., length 1-4: 0 typos, 5-8: 1 typo, 9+: 2 typos
      const allowedDistance = Math.floor((qToken.length - 1) / 4);
      // Also check for prefix matching for "search-as-you-type" feel
      return (
        tToken.startsWith(qToken) ||
        levenshteinDistance(qToken, tToken) <= allowedDistance
      );
    });
  });
};

interface UserCardProps {
  user: UserProfile;
  onClick: () => void;
  onMessageClick: (e: React.MouseEvent) => void;
  isOwnProfile: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onClick,
  onMessageClick,
  isOwnProfile,
}) => (
  <div
    className="bg-kadin-light-navy p-5 rounded-2xl border border-gray-700 text-center relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:border-kadin-gold/50 group shadow-lg"
    onClick={onClick}
  >
    <div className="relative inline-block">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 group-hover:border-kadin-gold transition-colors duration-300 object-cover"
      />
      {user.level === "Premium" && (
        <div className="absolute bottom-4 right-0 bg-kadin-gold text-kadin-navy p-1 rounded-full border-2 border-kadin-light-navy">
          <VerifiedIcon className="w-4 h-4" />
        </div>
      )}
    </div>
    <h3 className="text-lg font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold truncate px-2">
      {user.name}
    </h3>
    <p className="text-xs text-kadin-gold font-semibold mb-1 uppercase tracking-wider">
      {user.role}
    </p>
    <p className="text-sm text-kadin-light-slate truncate px-2">
      {user.company}
    </p>

    <div className="mt-4 flex justify-center gap-2 flex-wrap">
      <span className="text-[10px] bg-kadin-navy/50 text-kadin-slate px-2 py-1 rounded-full border border-gray-700">
        {user.industry}
      </span>
      <span className="text-[10px] bg-kadin-navy/50 text-kadin-slate px-2 py-1 rounded-full border border-gray-700">
        {user.region}
      </span>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="text-xs bg-gray-700 text-kadin-white font-bold py-2.5 rounded-xl hover:bg-gray-600 transition-colors"
      >
        Profile
      </button>
      <button
        onClick={onMessageClick}
        className="text-xs bg-kadin-gold text-kadin-navy font-bold py-2.5 rounded-xl hover:bg-yellow-400 transition-colors shadow-md shadow-kadin-gold/10"
      >
        Message
      </button>
    </div>
  </div>
);

interface MemberDirectoryProps {
  setCurrentPage: (page: Page, payload?: any) => void;
  user: UserProfile;
}

const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  setCurrentPage,
  user: currentUser,
}) => {
  const { members, loading } = useMembers();
  // Only initialize hook with valid ID to avoid Supabase errors on initial load
  const currentUserId =
    currentUser?.id &&
    currentUser.id.toString() !== "0" &&
    currentUser.id.toString() !== "..."
      ? currentUser.id.toString()
      : "";
  const { startConversation } = useMessages(currentUserId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  const filteredMembers = React.useMemo(() => {
    return members.filter((user) => {
      const searchableText = [
        user.name,
        user.company,
        user.role,
        user.industry,
        user.region,
        user.bio || "",
        ...(user.interests || []),
      ].join(" ");

      const matchesQuery = fuzzySearch(searchQuery, searchableText);
      const matchesIndustry =
        selectedIndustry === "All Industries" ||
        user.industry === selectedIndustry;
      const matchesRegion =
        selectedRegion === "All Regions" || user.region === selectedRegion;
      const matchesLevel =
        selectedLevel === "All Levels" || user.level === selectedLevel;

      return matchesQuery && matchesIndustry && matchesRegion && matchesLevel;
    });
  }, [searchQuery, selectedIndustry, selectedRegion, selectedLevel, members]);

  const handleMessageClick = async (
    e: React.MouseEvent,
    targetUser: UserProfile,
  ) => {
    e.stopPropagation();

    if (!currentUserId) {
      alert("Please log in to start a conversation.");
      return;
    }

    try {
      const conversationId = await startConversation(targetUser.id.toString());
      if (conversationId) {
        setCurrentPage("Communication");
      } else {
        throw new Error("Could not create conversation");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start conversation. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-kadin-white">
            Member Directory
          </h2>
          <p className="text-kadin-slate mt-1">
            Discover and connect with {members.length} fellow KADIN members.
          </p>
        </div>
      </div>

      <div className="bg-kadin-light-navy/50 p-4 rounded-2xl border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center flex-wrap shadow-xl">
        <input
          type="text"
          placeholder="Search by name, company, industry, or interest..."
          className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
        >
          <option>All Industries</option>
          <option>Technology</option>
          <option>Agriculture</option>
          <option>Manufacturing</option>
          <option>Energy</option>
          <option>F&B</option>
        </select>
        <select
          className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option>All Regions</option>
          <option>Jakarta</option>
          <option>Surabaya</option>
          <option>Bandung</option>
          <option>International</option>
        </select>
        <select
          className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option>All Levels</option>
          <option>Premium</option>
          <option>Verified</option>
          <option>Active</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="flex justify-center items-center">
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
            <p className="text-kadin-light-slate ml-4 text-lg">
              Loading members...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <UserCard
                key={member.id}
                user={member}
                onClick={() => setCurrentPage("Profile", member)}
                onMessageClick={(e) => handleMessageClick(e, member)}
                isOwnProfile={
                  member.id.toString() === currentUser.id.toString()
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-kadin-slate">
              <p>No members found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberDirectory;
