import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { WorkProgramReport } from "@/types";

export const useWorkProgramReports = (userId?: string) => {
  const [reports, setReports] = useState<WorkProgramReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("work_program_reports")
        .select(
          `
                    *,
                    user:submitted_by (
                        name
                    )
                `,
        )
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("submitted_by", userId);
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;

      const formattedData =
        data?.map((item) => ({
          ...item,
          user_name: item.user?.name,
        })) || [];

      setReports(formattedData);
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async (reportData: Partial<WorkProgramReport>) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: dbError } = await supabase
        .from("work_program_reports")
        .insert([
          {
            ...reportData,
            submitted_by: user.id,
          },
        ])
        .select();

      if (dbError) throw dbError;

      fetchReports();
      return { success: true };
    } catch (err: any) {
      console.error("Error submitting report:", err);
      return { success: false, error: err.message };
    }
  };

  const uploadReportFile = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `reports/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("reports")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("reports").getPublicUrl(filePath);

      return { success: true, url: publicUrl };
    } catch (err: any) {
      console.error("Error uploading file:", err);
      return { success: false, error: err.message };
    }
  };

  const updateReportStatus = async (
    id: string,
    status: WorkProgramReport["status"],
    feedback?: string,
  ) => {
    try {
      const { error: dbError } = await supabase
        .from("work_program_reports")
        .update({ status, feedback, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (dbError) throw dbError;

      setReports((prev) =>
        prev.map((rep) => (rep.id === id ? { ...rep, status, feedback } : rep)),
      );
      return { success: true };
    } catch (err: any) {
      console.error("Error updating report status:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchReports();
  }, [userId]);

  return {
    reports,
    loading,
    error,
    submitReport,
    uploadReportFile,
    updateReportStatus,
    refresh: fetchReports,
  };
};
