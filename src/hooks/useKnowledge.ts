import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { KnowledgeEntry } from "@/types";

export const useKnowledge = (onlyApproved: boolean = true) => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("knowledge_base")
        .select(
          `
          *,
          author:users(name, avatar_url)
        `,
        )
        .order("created_at", { ascending: false });

      if (onlyApproved) {
        query = query.eq("status", "approved");
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      if (data) {
        const mappedData: KnowledgeEntry[] = data.map((item: any) => ({
          id: item.id,
          created_at: item.created_at,
          title: item.title,
          category: item.category,
          content: item.content,
          image_url:
            item.image_url ||
            `https://picsum.photos/seed/knowledge${item.id}/400/200`,
          author_id: item.author_id,
          author_name: item.author?.name || "Unknown",
          author_avatar: item.author?.avatar_url || "https://picsum.photos/100",
          status: item.status,
        }));
        setEntries(mappedData);
      }
    } catch (err: any) {
      console.error("Error fetching knowledge entries:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (
    entry: Omit<
      KnowledgeEntry,
      "id" | "created_at" | "status" | "author_name" | "author_avatar"
    >,
  ) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("knowledge_base")
        .insert([
          {
            title: entry.title,
            category: entry.category,
            content: entry.content,
            image_url: entry.image_url,
            author_id: entry.author_id,
            status: "pending", // Default to pending
          },
        ])
        .select();

      if (supabaseError) throw supabaseError;
      await fetchEntries();
      return { success: true };
    } catch (err: any) {
      console.error("Error adding knowledge entry:", err);
      return { success: false, error: err.message };
    }
  };

  const updateEntryStatus = async (
    id: string,
    status: "approved" | "rejected",
  ) => {
    try {
      const { error: supabaseError } = await supabase
        .from("knowledge_base")
        .update({ status })
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      await fetchEntries();
      return { success: true };
    } catch (err: any) {
      console.error("Error updating knowledge entry status:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from("knowledge_base")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      await fetchEntries();
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting knowledge entry:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [onlyApproved]);

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntryStatus,
    deleteEntry,
    refresh: fetchEntries,
  };
};
