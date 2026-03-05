import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { CommunityGroup, AddGroupInput } from "@/types";

export const useCommunityGroups = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
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
  }, []);

  return { groups, loading, error, addGroup, refresh: fetchGroups };
};
