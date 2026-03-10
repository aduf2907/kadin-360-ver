import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { CommunityGroup, AddGroupInput } from "@/types";

export const useCommunityGroups = (userId?: string) => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("community_groups")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setGroups(data || []);
    } catch (err: any) {
      console.error("Error fetching groups:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedGroups = async () => {
    if (!userId) return;
    try {
      const { data, error: supabaseError } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", userId);

      if (supabaseError) throw supabaseError;
      setJoinedGroups(data?.map((item) => item.group_id) || []);
    } catch (err: any) {
      console.error("Error fetching joined groups:", err);
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!userId) return { success: false, error: "User not authenticated" };
    try {
      // 1. Add to group_members
      const { error: joinError } = await supabase
        .from("group_members")
        .insert([{ group_id: groupId, user_id: userId }]);

      if (joinError) throw joinError;

      // 2. Increment member_count in community_groups
      // Note: In a real app, use an RPC for atomic increment
      const group = groups.find((g) => g.id === groupId);
      const currentCount = group?.member_count || 0;

      const { error: updateError } = await supabase
        .from("community_groups")
        .update({ member_count: currentCount + 1 })
        .eq("id", groupId);

      if (updateError) throw updateError;

      setJoinedGroups((prev) => [...prev, groupId]);
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, member_count: g.member_count + 1 } : g,
        ),
      );

      return { success: true };
    } catch (err: any) {
      console.error("Error joining group:", err);
      return { success: false, error: err.message };
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!userId) return { success: false, error: "User not authenticated" };
    try {
      // 1. Remove from group_members
      const { error: leaveError } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", userId);

      if (leaveError) throw leaveError;

      // 2. Decrement member_count
      const group = groups.find((g) => g.id === groupId);
      const currentCount = group?.member_count || 0;

      const { error: updateError } = await supabase
        .from("community_groups")
        .update({ member_count: Math.max(0, currentCount - 1) })
        .eq("id", groupId);

      if (updateError) throw updateError;

      setJoinedGroups((prev) => prev.filter((id) => id !== groupId));
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, member_count: Math.max(0, g.member_count - 1) }
            : g,
        ),
      );

      return { success: true };
    } catch (err: any) {
      console.error("Error leaving group:", err);
      return { success: false, error: err.message };
    }
  };

  const fetchAllGroups = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("community_groups")
        .select("*")
        .order("is_approved", { ascending: true })
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setGroups(data || []);
    } catch (err: any) {
      console.error("Error fetching all groups:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveGroup = async (groupId: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from("community_groups")
        .update({ is_approved: true })
        .eq("id", groupId);

      if (supabaseError) throw supabaseError;
      return { success: true };
    } catch (err: any) {
      console.error("Error approving group:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from("community_groups")
        .delete()
        .eq("id", groupId);

      if (supabaseError) throw supabaseError;
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting group:", err);
      return { success: false, error: err.message };
    }
  };

  const addGroup = async (group: AddGroupInput, imageFile?: File) => {
    try {
      let imageUrl = "";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `group-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("community-groups")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("community-groups").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { data, error: supabaseError } = await supabase
        .from("community_groups")
        .insert([
          {
            ...group,
            image_url: imageUrl,
            is_approved: false, // Always false initially
          },
        ])
        .select();

      if (supabaseError) throw supabaseError;
      return { success: true, data };
    } catch (err: any) {
      console.error("Error adding group:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchGroups();
    if (userId) {
      fetchJoinedGroups();
    }
  }, [userId]);

  return {
    groups,
    joinedGroups,
    loading,
    error,
    addGroup,
    approveGroup,
    deleteGroup,
    fetchAllGroups,
    joinGroup,
    leaveGroup,
    refresh: fetchGroups,
  };
};
