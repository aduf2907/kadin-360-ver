import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { CertificateRequest } from "@/types";

export const useCertificateRequests = (userId?: string) => {
  const [requests, setRequests] = useState<CertificateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("certificate_requests")
        .select("*, users(name)")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      const formattedData =
        data?.map((item) => ({
          ...item,
          user_name: item.users?.name,
        })) || [];

      setRequests(formattedData);
    } catch (err: any) {
      console.error("Error fetching certificate requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (
    type: string,
    purpose: string,
    userId: string,
  ) => {
    try {
      const { data, error: dbError } = await supabase
        .from("certificate_requests")
        .insert([
          {
            user_id: userId,
            type,
            purpose,
            status: "pending",
          },
        ])
        .select();

      if (dbError) throw dbError;

      setRequests((prev) => [data[0], ...prev]);
      return { success: true };
    } catch (err: any) {
      console.error("Error creating certificate request:", err);
      return { success: false, error: err.message };
    }
  };

  const updateRequestStatus = async (
    id: string,
    status: "approved" | "rejected",
    certificateUrl?: string,
    adminNotes?: string,
  ) => {
    try {
      const { error: dbError } = await supabase
        .from("certificate_requests")
        .update({
          status,
          certificate_url: certificateUrl,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (dbError) throw dbError;

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? {
                ...req,
                status,
                certificate_url: certificateUrl,
                admin_notes: adminNotes,
              }
            : req,
        ),
      );
      return { success: true };
    } catch (err: any) {
      console.error("Error updating certificate request:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  return {
    requests,
    loading,
    error,
    createRequest,
    updateRequestStatus,
    refresh: fetchRequests,
  };
};
