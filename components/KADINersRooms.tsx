import React, { useState, useEffect } from "react";
import { DiscussionEntry, ReplyEntry, UserProfile } from "../types";
import { useDiscussions } from "@/src/hooks/useDiscussions";

interface KADINersRoomsProps {
  user: UserProfile;
}

const ThreadItem: React.FC<{
  thread: DiscussionEntry;
  onClick: () => void;
}> = ({ thread, onClick }) => (
  <div
    className="flex items-center p-4 bg-kadin-light-navy hover:bg-kadin-navy rounded-lg border border-gray-700 transition-all duration-300 cursor-pointer hover:border-kadin-gold/50 group transform hover:-translate-y-1 shadow-sm"
    onClick={onClick}
  >
    <img
      src={thread.author_avatar}
      alt={thread.author_name}
      className="h-10 w-10 rounded-full mr-4 border border-gray-600"
    />
    <div className="flex-grow min-w-0">
      <h3 className="font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold truncate">
        {thread.title}
      </h3>
      <p className="text-xs text-kadin-slate">
        <span className="font-semibold text-kadin-light-slate">
          {thread.author_name}
        </span>{" "}
        posted in{" "}
        <span className="font-semibold text-kadin-gold">{thread.category}</span>
      </p>
    </div>
    <div className="text-center w-20 flex-shrink-0">
      <p className="font-bold text-kadin-white text-lg">
        {thread.replies_count}
      </p>
      <p className="text-xs text-kadin-slate">Replies</p>
    </div>
    <div className="text-right w-24 flex-shrink-0 hidden sm:block">
      <p className="text-sm text-kadin-light-slate">
        {new Date(thread.created_at).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const KADINersRooms: React.FC<KADINersRoomsProps> = ({ user }) => {
  const { discussions, loading, createDiscussion, fetchReplies, addReply } =
    useDiscussions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<DiscussionEntry | null>(
    null,
  );
  const [replies, setReplies] = useState<ReplyEntry[]>([]);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    category: "Investment & Policy",
    content: "",
  });

  const categories = [
    "Investment & Policy",
    "Energy & Resources",
    "Marketing",
    "Manufacturing",
    "Technology",
    "Legal & Tax",
  ];

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussion.title || !newDiscussion.content) return;

    const result = await createDiscussion({
      ...newDiscussion,
      author_id: user.id.toString(),
    });

    if (result.success) {
      setIsCreateModalOpen(false);
      setNewDiscussion({
        title: "",
        category: "Investment & Policy",
        content: "",
      });
    } else {
      alert("Failed to create discussion: " + result.error);
    }
  };

  const handleThreadClick = async (thread: DiscussionEntry) => {
    setSelectedThread(thread);
    setIsRepliesLoading(true);
    const threadReplies = await fetchReplies(thread.id);
    setReplies(threadReplies);
    setIsRepliesLoading(false);
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyContent.trim() || !selectedThread) return;

    setIsSubmittingReply(true);
    const result = await addReply({
      discussion_id: selectedThread.id,
      content: newReplyContent,
      author_id: user.id.toString(),
    });

    if (result.success) {
      setNewReplyContent("");
      const updatedReplies = await fetchReplies(selectedThread.id);
      setReplies(updatedReplies);
    } else {
      alert("Failed to add reply: " + result.error);
    }
    setIsSubmittingReply(false);
  };

  const filteredThreads = discussions.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      thread.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-kadin-white">
            KADINers Rooms
          </h2>
          <p className="text-kadin-slate mt-1">
            Connect, discuss, and share insights with fellow members.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-kadin-gold text-kadin-navy font-bold py-2.5 px-6 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-kadin-gold/10"
        >
          Start New Discussion
        </button>
      </div>

      <div className="bg-kadin-light-navy/50 p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-kadin-slate"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full bg-kadin-navy pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm border border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="bg-kadin-navy p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto border border-gray-700 text-kadin-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredThreads.length > 0
          ? filteredThreads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                onClick={() => handleThreadClick(thread)}
              />
            ))
          : !loading && (
              <div className="text-center py-20 bg-kadin-light-navy/30 rounded-2xl border border-dashed border-gray-700">
                <p className="text-kadin-slate">
                  No discussion threads found matching your search.
                </p>
              </div>
            )}
      </div>

      {/* Create Discussion Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-kadin-white">
                Start New Discussion
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-kadin-slate hover:text-kadin-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form
              onSubmit={handleCreateDiscussion}
              className="p-6 space-y-4 overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-3 text-kadin-white focus:border-kadin-gold outline-none"
                  value={newDiscussion.title}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Category
                </label>
                <select
                  className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-3 text-kadin-white focus:border-kadin-gold outline-none"
                  value={newDiscussion.category}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      category: e.target.value,
                    })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-kadin-slate mb-1">
                  Content
                </label>
                <textarea
                  required
                  className="w-full bg-kadin-navy border border-gray-700 rounded-lg p-3 text-kadin-white h-40 focus:border-kadin-gold outline-none resize-none"
                  value={newDiscussion.content}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      content: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2 border border-gray-700 rounded-lg text-kadin-white hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-kadin-gold text-kadin-navy rounded-lg font-bold hover:bg-yellow-400"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thread Detail Modal */}
      {selectedThread && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-kadin-light-navy border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-kadin-navy/50">
              <div className="flex items-center gap-3">
                <img
                  src={selectedThread.author_avatar}
                  alt=""
                  className="w-10 h-10 rounded-full border border-gray-600"
                />
                <div>
                  <h3 className="text-lg font-bold text-kadin-white leading-tight">
                    {selectedThread.title}
                  </h3>
                  <p className="text-xs text-kadin-slate mt-1">
                    By {selectedThread.author_name} in {selectedThread.category}{" "}
                    • {new Date(selectedThread.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedThread(null)}
                className="text-kadin-slate hover:text-kadin-white transition-colors p-2 hover:bg-gray-700 rounded-full"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Main Post */}
              <div className="bg-kadin-navy/30 p-6 rounded-xl border border-gray-700/50">
                <p className="text-kadin-light-slate leading-relaxed whitespace-pre-wrap text-lg">
                  {selectedThread.content}
                </p>
              </div>

              {/* Replies Section */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-kadin-white border-b border-gray-700 pb-2">
                  Replies ({replies.length})
                </h4>

                {replies.length > 0 ? (
                  <div className="space-y-4">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex gap-4 p-4 bg-kadin-navy/20 rounded-xl border border-gray-700/30"
                      >
                        <img
                          src={reply.author_avatar}
                          alt=""
                          className="w-8 h-8 rounded-full border border-gray-600 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-kadin-white">
                              {reply.author_name}
                            </span>
                            <span className="text-[10px] text-kadin-slate">
                              {new Date(reply.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-kadin-light-slate whitespace-pre-wrap">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !isRepliesLoading && (
                    <p className="text-center py-10 text-kadin-slate italic">
                      No replies yet. Start the conversation!
                    </p>
                  )
                )}
              </div>
            </div>

            {/* Reply Input */}
            <div className="p-6 border-t border-gray-700 bg-kadin-navy/50">
              <form onSubmit={handleAddReply} className="flex gap-4">
                <textarea
                  className="flex-1 bg-kadin-navy border border-gray-700 rounded-xl p-3 text-sm text-kadin-white focus:border-kadin-gold outline-none resize-none h-20"
                  placeholder="Write a reply..."
                  value={newReplyContent}
                  onChange={(e) => setNewReplyContent(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmittingReply || !newReplyContent.trim()}
                  className="bg-kadin-gold text-kadin-navy font-bold px-6 rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-all self-end h-12"
                >
                  {isSubmittingReply ? "..." : "Reply"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KADINersRooms;
