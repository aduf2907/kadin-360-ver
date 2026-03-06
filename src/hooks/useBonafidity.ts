import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { BonafidityLog, UserProfile } from "@/types";

export const useBonafidity = () => {
  const [logs, setLogs] = useState<BonafidityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserLogs = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("bonafidity_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setLogs(data || []);
    } catch (err: any) {
      console.error("Error fetching bonafidity logs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserBonafidity = async (
    userId: string,
    newStatus: string,
    newScore: number,
    reason: string,
    oldStatus: string,
    oldScore: number,
  ) => {
    try {
      setLoading(true);

      // 1. Update user table
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({
          bonafidity_status: newStatus.toLowerCase(),
          rating: newScore,
        })
        .eq("id", userId);

      if (userUpdateError) throw userUpdateError;

      // 2. Insert log
      const { error: logError } = await supabase
        .from("bonafidity_logs")
        .insert([
          {
            user_id: userId,
            old_status: oldStatus,
            new_status: newStatus,
            old_score: oldScore,
            new_score: newScore,
            reason: reason,
            admin_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ]);

      if (logError) throw logError;

      return { success: true };
    } catch (err: any) {
      console.error("Error updating bonafidity:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("users")
        .select("id, name, company, bonafidity_status, rating")
        .order("name");

      if (supabaseError) throw supabaseError;
      return data;
    } catch (err: any) {
      console.error("Error fetching users for bonafidity:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    loading,
    error,
    fetchUserLogs,
    updateUserBonafidity,
    fetchAllUsers,
  };
};
