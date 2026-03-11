import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { Activity } from "@/types";

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try fetching with join and order first
      let { data, error: supabaseError } = await supabase
        .from("activities")
        .select(
          `
                    *,
                    assignee:assigned_to (
                        name,
                        avatar
                    )
                `,
        )
        .order("created_at", { ascending: false });

      // If join fails, try without join
      if (supabaseError) {
        console.warn("Join fetch failed, trying simple fetch:", supabaseError);
        const { data: simpleData, error: simpleError } = await supabase
          .from("activities")
          .select("*")
          .order("created_at", { ascending: false });

        if (simpleError) {
          console.warn(
            "Simple fetch with order failed, trying without order:",
            simpleError,
          );
          // If order fails (maybe created_at doesn't exist), try without order
          const { data: noOrderData, error: noOrderError } = await supabase
            .from("activities")
            .select("*");

          if (noOrderError) throw noOrderError;
          data = noOrderData;
        } else {
          data = simpleData;
        }
      }

      const formattedData =
        data?.map((item) => {
          // Try to find status in common column names
          let rawStatus = item.status || item.state || item.Status || "Todo";
          let status: Activity["status"] = "Todo";

          if (typeof rawStatus === "string") {
            const s = rawStatus.trim().toLowerCase();
            if (s === "todo" || s === "to do" || s === "to_do") status = "Todo";
            else if (
              s === "in progress" ||
              s === "in_progress" ||
              s === "inprogress"
            )
              status = "In Progress";
            else if (s === "completed" || s === "done" || s === "finish")
              status = "Completed";
            else if (s === "on hold" || s === "on_hold" || s === "hold")
              status = "On Hold";
          }

          return {
            ...item,
            title:
              item.title || item.name || item.subject || "Untitled Activity",
            description: item.description || item.content || item.summary || "",
            status,
            assignee_name: item.assignee?.name || item.assignee_name,
            assignee_avatar: item.assignee?.avatar || item.assignee_avatar,
          };
        }) || [];

      setActivities(formattedData);
    } catch (err: any) {
      console.error("Error fetching activities:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData: Partial<Activity>) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Sanitize data: convert empty strings to null for UUID and Date fields
      const sanitizedData = {
        ...activityData,
        assigned_to: activityData.assigned_to || null,
        due_date: activityData.due_date || null,
        status: activityData.status || "Todo",
        created_by: user.id,
      };

      const { data, error: dbError } = await supabase
        .from("activities")
        .insert([sanitizedData])
        .select();

      if (dbError) throw dbError;

      // Refresh list
      fetchActivities();
      return { success: true };
    } catch (err: any) {
      console.error("Error creating activity:", err);
      return { success: false, error: err.message };
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    try {
      // Sanitize data: convert empty strings to null for UUID and Date fields
      const sanitizedUpdates = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (updates.assigned_to === "") sanitizedUpdates.assigned_to = null;
      if (updates.due_date === "") sanitizedUpdates.due_date = null;

      const { error: dbError } = await supabase
        .from("activities")
        .update(sanitizedUpdates)
        .eq("id", id);

      if (dbError) throw dbError;

      setActivities((prev) =>
        prev.map((act) => (act.id === id ? { ...act, ...updates } : act)),
      );
      return { success: true };
    } catch (err: any) {
      console.error("Error updating activity:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error: dbError } = await supabase
        .from("activities")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      setActivities((prev) => prev.filter((act) => act.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting activity:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    createActivity,
    updateActivity,
    deleteActivity,
    refresh: fetchActivities,
  };
};
