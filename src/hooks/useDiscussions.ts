import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { DiscussionEntry, ReplyEntry } from "@/types";

export const useDiscussions = () => {
  const [discussions, setDiscussions] = useState<DiscussionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("discussions")
        .select(
          `
                    *,
                    author:users(name, avatar_url),
                    replies:discussion_replies(count)
                `,
        )
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      if (data) {
        const mappedData: DiscussionEntry[] = data.map((item: any) => ({
          id: item.id,
          created_at: item.created_at,
          title: item.title,
          category: item.category,
          content: item.content,
          author_id: item.author_id,
          author_name: item.author?.name || "Unknown",
          author_avatar: item.author?.avatar_url || "https://picsum.photos/100",
          replies_count: item.replies?.[0]?.count || 0,
        }));
        setDiscussions(mappedData);
      }
    } catch (err: any) {
      console.error("Error fetching discussions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDiscussion = async (
    discussion: Omit<
      DiscussionEntry,
      "id" | "created_at" | "replies_count" | "author_name" | "author_avatar"
    >,
  ) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("discussions")
        .insert([discussion])
        .select();

      if (supabaseError) throw supabaseError;
      await fetchDiscussions();
      return { success: true, data };
    } catch (err: any) {
      console.error("Error creating discussion:", err);
      return { success: false, error: err.message };
    }
  };

  const fetchReplies = async (discussionId: string) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("discussion_replies")
        .select(
          `
                    *,
                    author:users(name, avatar_url)
                `,
        )
        .eq("discussion_id", discussionId)
        .order("created_at", { ascending: true });

      if (supabaseError) throw supabaseError;

      if (data) {
        return data.map((item: any) => ({
          id: item.id,
          created_at: item.created_at,
          discussion_id: item.discussion_id,
          content: item.content,
          author_id: item.author_id,
          author_name: item.author?.name || "Unknown",
          author_avatar: item.author?.avatar_url || "https://picsum.photos/100",
        })) as ReplyEntry[];
      }
      return [];
    } catch (err: any) {
      console.error("Error fetching replies:", err);
      return [];
    }
  };

  const addReply = async (
    reply: Omit<
      ReplyEntry,
      "id" | "created_at" | "author_name" | "author_avatar"
    >,
  ) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("discussion_replies")
        .insert([reply])
        .select();

      if (supabaseError) throw supabaseError;
      await fetchDiscussions(); // To update replies count
      return { success: true, data };
    } catch (err: any) {
      console.error("Error adding reply:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return {
    discussions,
    loading,
    error,
    createDiscussion,
    fetchReplies,
    addReply,
    refresh: fetchDiscussions,
  };
};
