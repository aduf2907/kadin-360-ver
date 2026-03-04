import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "../types";
import { useMessages, Message, Conversation } from "@/src/hooks/useMessage";

const TranslateIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M3 5h12M9 3v2m4 1h5l-5 5h5l-5 5M4 17h5m-5-5h5m2 0h5M12 21a9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9z"
    />
  </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

interface CommunicationProps {
  user: UserProfile;
}

const Communication: React.FC<CommunicationProps> = ({ user }) => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    loading,
    messagesLoading,
    sendMessage,
  } = useMessages(user.id.toString());

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeConversation) return;
    const content = newMessage;
    setNewMessage("");
    await sendMessage(activeConversation.id, content);
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.other_user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.other_user?.company
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const formatTime = (isoDate: string) => {
    return new Date(isoDate).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-kadin-white mb-6">
        Communication Hub
      </h2>
      <div className="flex h-[75vh] rounded-2xl overflow-hidden bg-kadin-light-navy border border-gray-700 shadow-2xl">
        {/* Contact List */}
        <div className="w-full md:w-1/3 border-r border-gray-700 flex flex-col bg-kadin-navy/30">
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-kadin-slate"
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
                placeholder="Search contacts..."
                className="w-full bg-kadin-navy pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-kadin-gold border border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredConversations.length > 0 ? (
              <ul className="divide-y divide-gray-700/50">
                {filteredConversations.map((conv) => (
                  <li
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className={`flex items-center p-4 cursor-pointer transition-all duration-200 ${activeConversation?.id === conv.id ? "bg-kadin-gold/10 border-l-4 border-l-kadin-gold" : "hover:bg-kadin-navy/40 border-l-4 border-l-transparent"}`}
                  >
                    <img
                      src={conv.other_user?.avatar}
                      className="h-12 w-12 rounded-full mr-4 border border-gray-700"
                      alt="contact"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p
                          className={`font-semibold truncate ${activeConversation?.id === conv.id ? "text-kadin-gold" : "text-kadin-white"}`}
                        >
                          {conv.other_user?.name}
                        </p>
                        {conv.last_message && (
                          <span className="text-[10px] text-kadin-slate ml-2">
                            {formatTime(conv.last_message.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-kadin-slate truncate">
                        {conv.other_user?.company}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-10 px-4">
                <p className="text-sm text-kadin-slate italic">
                  No conversations found.
                </p>
                <p className="text-xs text-kadin-slate/60 mt-2">
                  Connect with members from the Directory to start chatting.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div
          className={`flex-1 flex flex-col bg-kadin-navy/10 ${!activeConversation ? "hidden md:flex" : "flex"}`}
        >
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-kadin-light-navy/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConversation.other_user?.avatar}
                    className="h-10 w-10 rounded-full border border-gray-600"
                    alt="avatar"
                  />
                  <div>
                    <h3 className="font-bold text-kadin-white text-base leading-tight">
                      {activeConversation.other_user?.name}
                    </h3>
                    <p className="text-xs text-kadin-gold">
                      {activeConversation.other_user?.role} at{" "}
                      {activeConversation.other_user?.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-kadin-slate hover:text-kadin-gold hover:bg-kadin-navy rounded-full transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 text-kadin-slate hover:text-kadin-gold hover:bg-kadin-navy rounded-full transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.sender_id === user.id.toString() ? "justify-end" : ""}`}
                  >
                    {msg.sender_id !== user.id.toString() && (
                      <img
                        src={activeConversation.other_user?.avatar}
                        className="h-8 w-8 rounded-full border border-gray-700 mb-1"
                        alt="avatar"
                      />
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 shadow-lg ${msg.sender_id === user.id.toString() ? "bg-kadin-gold text-kadin-navy rounded-br-none" : "bg-gray-700 text-kadin-white rounded-bl-none"}`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p
                        className={`text-[10px] mt-1 opacity-60 font-mono ${msg.sender_id === user.id.toString() ? "text-right" : "text-left"}`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                    {msg.sender_id !== user.id.toString() && (
                      <button
                        title="Translate Message"
                        className="text-kadin-slate hover:text-kadin-gold p-1 mb-1"
                      >
                        <TranslateIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-700 bg-kadin-light-navy/50 flex items-center gap-3">
                <button className="p-2 text-kadin-slate hover:text-kadin-gold transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-kadin-navy p-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm border border-gray-700 shadow-inner"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 rounded-2xl bg-kadin-gold text-kadin-navy hover:bg-yellow-400 transition-all shadow-lg shadow-kadin-gold/20 disabled:opacity-50 disabled:shadow-none"
                >
                  <SendIcon className="h-6 w-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-kadin-navy/5">
              <div className="w-24 h-24 bg-kadin-light-navy rounded-full flex items-center justify-center mb-6 border border-gray-700 shadow-xl">
                <svg
                  className="w-12 h-12 text-kadin-gold opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-kadin-white mb-2">
                Select a conversation
              </h3>
              <p className="text-kadin-slate max-w-xs">
                Choose a contact from the list on the left to start messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Communication;
