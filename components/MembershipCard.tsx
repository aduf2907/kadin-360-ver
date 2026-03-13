import React from "react";
import { UserProfile } from "../types";

interface MembershipCardProps {
  user: UserProfile;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ user }) => {
  const levelColor = {
    Premium: "bg-kadin-gold text-kadin-navy",
    Verified: "bg-blue-500 text-white",
    Active: "bg-gray-600 text-white",
    New: "bg-gray-700 text-kadin-slate",
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-kadin-white mb-2">
        Digital Membership Card
      </h2>
      <p className="text-kadin-light-slate mb-8">
        Present this digital card for access to exclusive KADIN events and
        partner benefits.
      </p>

      <div className="max-w-xl mx-auto" style={{ perspective: "1000px" }}>
        {/* The Card */}
        <div className="w-full bg-gradient-to-br from-kadin-navy to-kadin-light-navy p-6 rounded-2xl shadow-2xl border border-gray-700/50 transition-transform duration-500 ease-in-out hover:rotate-y-3">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-kadin-gold/20">
            <h3 className="text-2xl font-bold text-kadin-white">
              KADIN <span className="text-kadin-gold">360</span>
            </h3>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${levelColor[user.level]}`}
            >
              {user.level} Member
            </span>
          </div>

          {/* Body */}
          <div className="flex items-center mt-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 rounded-full border-4 border-kadin-gold"
            />
            <div className="ml-6 flex-1">
              <p className="text-xs text-kadin-slate font-semibold">NAME</p>
              <h4 className="text-2xl font-bold text-kadin-white">
                {user.name}
              </h4>

              <p className="text-xs text-kadin-slate font-semibold mt-2">
                COMPANY
              </p>
              <p className="text-md text-kadin-light-slate">{user.company}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-between items-end">
            <div>
              <p className="text-xs text-kadin-slate font-semibold">
                MEMBER ID
              </p>
              <p className="font-mono text-lg text-kadin-white tracking-wider">
                {user.membershipId}
              </p>

              <p className="text-xs text-kadin-slate font-semibold mt-2">
                VALID THRU
              </p>
              <p className="font-mono text-md text-kadin-light-slate">
                {user.created_at
                  ? (() => {
                      const date = new Date(user.created_at);
                      date.setDate(date.getDate() + 30);
                      return date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      });
                    })()
                  : user.validThru}
              </p>
            </div>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${user.membershipId}&bgcolor=0A192F&color=D4AF37&qzone=1`}
              alt="QR Code"
              className="rounded-lg border-2 border-kadin-gold/50"
            />
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button className="bg-kadin-gold text-kadin-navy font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center">
          <svg
            className="w-5 h-5 mr-2"
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
          Download Card
        </button>
      </div>
    </div>
  );
};

export default MembershipCard;
