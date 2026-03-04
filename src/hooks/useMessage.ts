import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { UserProfile } from "@/types";

export interface Message {
  id: string;
  created_at: string;
  conversation_id: string;
  sender_id: string;
  content: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  user_1: string;
  user_2: string;
  other_user?: UserProfile;
  last_message?: Message;
}

export const useMessages = (currentUserId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
                    *,
                    user1_profile:users!conversations_user_1_fkey(id, name, avatar_url, company, role),
                    user2_profile:users!conversations_user_2_fkey(id, name, avatar_url, company, role)
                `,
        )
        .or(`user_1.eq.${currentUserId},user_2.eq.${currentUserId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const mapped = data.map((conv: any) => {
          const otherUser =
            conv.user_1 === currentUserId
              ? conv.user2_profile
              : conv.user1_profile;
          return {
            ...conv,
            other_user: {
              id: otherUser.id,
              name: otherUser.name,
              avatar: otherUser.avatar_url,
              company: otherUser.company,
              role: otherUser.role,
            },
          };
        });
        setConversations(mapped);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setMessagesLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversationId,
            sender_id: currentUserId,
            content,
          },
        ])
        .select();

      if (error) throw error;

      // Optimistic update or just refetch
      if (data) {
        setMessages((prev) => [...prev, data[0]]);
      }
      return { success: true };
    } catch (err) {
      console.error("Error sending message:", err);
      return { success: false, error: err };
    }
  };

  const startConversation = async (otherUserId: string) => {
    if (!currentUserId || !otherUserId) return null;

    try {
      // Check if conversation already exists
      const { data: existing, error: checkError } = await supabase
        .from("conversations")
        .select("*")
        .or(
          `and(user_1.eq.${currentUserId},user_2.eq.${otherUserId}),and(user_1.eq.${otherUserId},user_2.eq.${currentUserId})`,
        )
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing conversation:", checkError);
      }

      if (existing) {
        setActiveConversation(existing);
        return existing.id;
      }

      // Create new
      // Ensure consistent ordering of user IDs to prevent duplicate conversations
      const [u1, u2] = [currentUserId, otherUserId].sort();
      const { data, error } = await supabase
        .from("conversations")
        .insert([{ user_1: u1, user_2: u2 }])
        .select()
        .maybeSingle();

      if (error) throw error;
      if (data) {
        await fetchConversations();
        setActiveConversation(data);
        return data.id;
      }
      return null;
    } catch (err) {
      console.error("Error starting conversation:", err);
      return null;
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);

      // Subscribe to new messages
      const channel = supabase
        .channel(`messages:${activeConversation.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${activeConversation.id}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            if (newMessage.sender_id !== currentUserId) {
              setMessages((prev) => [...prev, newMessage]);
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeConversation, currentUserId]);

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    loading,
    messagesLoading,
    sendMessage,
    startConversation,
    refreshConversations: fetchConversations,
  };
};
