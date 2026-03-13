import React, { useState } from "react";
import { UserProfile, Page, UserReview } from "../types";
import { requestVerification } from "../services/verificationService";
import VerifiedIcon from "./icons/VerifiedIcon";
import { followUser, unfollowUser } from "../services/followService";
import { useUserProfile } from "@/src/hooks/useUserProfile";

interface ProfileProps {
  user: UserProfile;
  mainUser: UserProfile; // The currently logged-in user
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setCurrentPage: (page: Page, payload?: any) => void;
  isOwnProfile: boolean;
}

const StarIcon: React.FC<{
  filled: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}> = ({ filled, className, ...props }) => (
  <svg
    className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-600"} ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Profile: React.FC<ProfileProps> = ({
  user,
  mainUser,
  setUser,
  setCurrentPage,
  isOwnProfile,
}) => {
  const [verificationStatus, setVerificationStatus] = useState<{
    status: string;
    message: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const { profile, setProfile, loading } = useUserProfile();

  // State for the new review section
  const [reviews, setReviews] = useState<UserReview[]>(user.reviews || []);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleVerification = async () => {
    setIsVerifying(true);
    setVerificationStatus(null);
    const result = await requestVerification("KTP (ID Card)", user.name);
    setVerificationStatus(result);
    setIsVerifying(false);

    if (result.status === "success" && isOwnProfile) {
      setUser((prevUser) => ({
        ...prevUser,
        level: "Verified",
      }));
      // Clear the message after a delay
      setTimeout(() => {
        setVerificationStatus(null);
      }, 4000);
    }
  };

  const handleFollowToggle = async () => {
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        const response = await unfollowUser(user.id);
        if (response.success) {
          setIsFollowing(false);
        }
      } else {
        const response = await followUser(user.id);
        if (response.success) {
          setIsFollowing(true);
        }
      }
    } catch (error) {
      console.error("Failed to update follow status:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewRating === 0 || !newReviewComment.trim()) return;

    const newReview: UserReview = {
      id: Date.now(),
      reviewerId: mainUser.id,
      reviewerName: mainUser.name,
      reviewerAvatar: mainUser.avatar_url,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setNewReviewRating(0);
    setNewReviewComment("");
    setReviewSubmitted(true);

    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const isVerified = user.level === "Verified" || user.level === "Premium";

  const statusConfig = {
    Green: {
      emoji: "🟩",
      title: "Bonafide",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/50",
    },
    Yellow: {
      emoji: "🟨",
      title: "Needs Verification",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/50",
    },
    Red: {
      emoji: "🟥",
      title: "High Risk",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/50",
    },
    Black: {
      emoji: "⬛",
      title: "Blocked",
      color: "text-gray-500",
      bgColor: "bg-gray-700/20",
      borderColor: "border-gray-600",
    },
  };

  const userStatus = statusConfig[user.bonafidityStatus];

  const formatTimeAgo = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30);
    const years = Math.round(days / 365);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    if (months < 12) return `${months}mo ago`;
    return `${years}y ago`;
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-kadin-white mb-6">
        {isOwnProfile ? "My Profile" : `${user.name}'s Profile`}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Membership Card Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700 text-center">
            <img
              src={profile?.avatar_url}
              alt={profile?.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-kadin-gold"
            />
            <h3 className="text-2xl font-bold text-kadin-white flex items-center justify-center gap-2">
              {profile?.name}
              {isVerified && <VerifiedIcon className="h-6 w-6 text-blue-400" />}
            </h3>
            <p className="text-kadin-light-slate">
              {profile?.role} at {profile?.company}
            </p>
            <div className="mt-2 flex justify-center items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${profile?.level === "Premium" ? "bg-kadin-gold text-kadin-navy" : profile?.level === "Verified" ? "bg-blue-600 text-kadin-white" : "bg-gray-600 text-kadin-white"}`}
              >
                {profile?.level} Member
              </span>
            </div>

            <div
              onClick={() => setCurrentPage("Bonafiditas")}
              className={`mt-4 p-2 rounded-lg border cursor-pointer hover:bg-opacity-20 transition-all text-left flex items-center gap-3`}
              title="Click to see Bonafidity details"
            >
              {/* <span className="text-2xl">{userStatus.emoji}</span> */}
              <div className="flex-1">
                {/* <p className={`font-bold text-sm ${userStatus.color}`}> */}
                {/* {userStatus.title}
                </p> */}
                <p className="text-xs text-kadin-slate">
                  Score: <span className="font-bold">{user.rating}</span>/100
                </p>
              </div>
              <svg
                className="w-4 h-4 text-kadin-slate"
                xmlns="http://www.w3.org/2000/svg"
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
            </div>

            {isOwnProfile ? (
              <button
                onClick={() => setCurrentPage("Edit Profile")}
                className="mt-6 w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="mt-6 flex items-center space-x-3">
                <button
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                  className={`w-full font-bold py-2 rounded-lg transition-colors ${
                    isFollowing
                      ? "bg-transparent border border-kadin-gold text-kadin-gold hover:bg-kadin-gold/10"
                      : "bg-kadin-gold text-kadin-navy hover:bg-yellow-400"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isFollowLoading
                    ? "..."
                    : isFollowing
                      ? "Following"
                      : "Follow"}
                </button>
                <button
                  onClick={() => setCurrentPage("Communication")}
                  className="w-full bg-gray-600 text-kadin-white font-bold py-2 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Message
                </button>
              </div>
            )}
          </div>

          {/* Membership Card Preview (Only for own profile) */}
          {isOwnProfile && (
            <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-bold text-kadin-white mb-4 text-center">
                Digital Card Preview
              </h4>

              {/* Mini Card */}
              <div
                className="bg-gradient-to-br from-kadin-navy to-kadin-light-navy/80 p-4 rounded-lg shadow-lg border border-gray-700/50 cursor-pointer group"
                onClick={() => setCurrentPage("Membership Card")}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={profile?.avatar_url}
                    alt={profile?.name}
                    className="w-16 h-16 rounded-full border-2 border-kadin-gold transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-kadin-white text-lg truncate">
                      {profile?.name}
                    </p>
                    <p className="font-mono text-xs text-kadin-slate tracking-wider">
                      {profile?.membershipId}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-end">
                  <div className="text-left">
                    <p className="text-xs text-kadin-slate font-semibold">
                      VALID THRU
                    </p>
                    <p className="font-mono text-sm text-kadin-light-slate">
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
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${profile?.membershipId}&bgcolor=0A192F&color=D4AF37&qzone=1`}
                    alt="QR Code"
                    className="rounded-md border border-kadin-gold/50"
                  />
                </div>
              </div>
              <button
                onClick={() => setCurrentPage("Membership Card")}
                className="mt-4 w-full border border-kadin-gold text-kadin-gold font-bold py-2 rounded-lg hover:bg-kadin-gold hover:text-kadin-navy transition-colors text-sm"
              >
                View Full Card
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Details & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
            <h4 className="text-xl font-bold text-kadin-white border-b border-gray-700 pb-3 mb-4">
              About
            </h4>
            <p className="text-kadin-slate text-sm">
              {profile?.bio || "No biography provided."}
            </p>

            <h4 className="text-xl font-bold text-kadin-white border-b border-gray-700 pb-3 my-4">
              Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-kadin-light-slate">Industry</p>
                <p className="text-kadin-white">{profile?.industry}</p>
              </div>
              <div>
                <p className="font-semibold text-kadin-light-slate">Region</p>
                <p className="text-kadin-white">{profile?.region}</p>
              </div>
            </div>

            <h4 className="text-xl font-bold text-kadin-white border-b border-gray-700 pb-3 my-4">
              Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile?.interests?.map((interest) => (
                <span
                  key={interest}
                  className="text-xs bg-gray-700 text-kadin-light-slate px-3 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* User Reviews Section */}
          <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
            <h4 className="text-xl font-bold text-kadin-white border-b border-gray-700 pb-3 mb-4">
              User Reviews
            </h4>

            {/* Leave a Review Form (only on others' profiles) */}
            {!isOwnProfile && (
              <div className="mb-6">
                {reviewSubmitted ? (
                  <div className="p-4 bg-green-500/10 text-green-400 rounded-md text-center font-semibold">
                    Thank you for your feedback!
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    <h5 className="font-bold text-kadin-white mb-2">
                      Leave a Review
                    </h5>
                    <div
                      className="flex items-center space-x-1 mb-3"
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          filled={(hoverRating || newReviewRating) >= star}
                          className="cursor-pointer"
                          onClick={() => setNewReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                        />
                      ))}
                    </div>
                    <textarea
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      rows={3}
                      placeholder={`Share your experience working with ${user.name}...`}
                      className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm"
                    />
                    <button
                      type="submit"
                      disabled={
                        newReviewRating === 0 || !newReviewComment.trim()
                      }
                      className="mt-3 bg-kadin-gold text-kadin-navy font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
                <hr className="border-gray-700 my-6" />
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="flex items-start space-x-4">
                    <img
                      src={review.reviewerAvatar}
                      alt={review.reviewerName}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-kadin-white">
                          {review.reviewerName}
                        </h5>
                        <span className="text-xs text-kadin-slate">
                          {formatTimeAgo(review.date)}
                        </span>
                      </div>
                      <div className="flex items-center my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon key={star} filled={review.rating >= star} />
                        ))}
                      </div>
                      <p className="text-sm text-kadin-slate">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-kadin-slate text-sm text-center py-4">
                  No reviews yet.{" "}
                  {isOwnProfile ? "" : "Be the first to leave one!"}
                </p>
              )}
            </div>
          </div>

          {!isVerified && isOwnProfile && (
            <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700 mt-6">
              <h4 className="text-xl font-bold text-kadin-white border-b border-gray-700 pb-3 mb-4">
                Account Verification
              </h4>
              {verificationStatus ? (
                <div
                  className={`p-3 rounded-md text-sm mb-4 ${verificationStatus.status === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                >
                  {verificationStatus.message}
                </div>
              ) : (
                <p className="text-kadin-slate text-sm mb-4">
                  Verify your account to gain access to premium features and
                  increase your trust score within the community.
                </p>
              )}
              <button
                onClick={handleVerification}
                disabled={isVerifying}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isVerifying ? "Verifying..." : "Start Verification"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
