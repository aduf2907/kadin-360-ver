import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { BusinessConsultation, BusinessAdvisor } from "@/types";

export const useBusinessAdvisor = () => {
  const [advisors, setAdvisors] = useState<BusinessAdvisor[]>([]);
  const [consultations, setConsultations] = useState<BusinessConsultation[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvisors = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("business_advisors")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setAdvisors(data || []);
    } catch (err: any) {
      console.error("Error fetching business advisors:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultations = async (userId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from("business_consultations")
        .select(
          `
                    *,
                    users!user_id (
                        name
                    )
                `,
        )
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      const mappedData =
        data?.map((item) => ({
          ...item,
          user_name: item.users
            ? Array.isArray(item.users)
              ? item.users[0]?.name
              : item.users.name
            : "Unknown",
        })) || [];

      setConsultations(mappedData);
    } catch (err: any) {
      console.error("Error fetching business consultations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addAdvisor = async (
    advisor: Omit<BusinessAdvisor, "id" | "created_at">,
    imageFile?: File,
  ) => {
    try {
      let avatarUrl = advisor.avatar_url;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `business-advisor-avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("business-attachments")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("business-attachments")
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const { data, error: supabaseError } = await supabase
        .from("business_advisors")
        .insert([{ ...advisor, avatar_url: avatarUrl }])
        .select();

      if (supabaseError) throw supabaseError;
      return { success: true, data };
    } catch (err: any) {
      console.error("Error adding business advisor:", err);
      return { success: false, error: err.message };
    }
  };

  const submitConsultation = async (
    consultation: Omit<
      BusinessConsultation,
      | "id"
      | "created_at"
      | "updated_at"
      | "status"
      | "admin_response"
      | "user_name"
    >,
    attachmentFile?: File,
  ) => {
    try {
      let attachmentUrl = "";

      if (attachmentFile) {
        const fileExt = attachmentFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `business-consultation-attachments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("business-attachments")
          .upload(filePath, attachmentFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("business-attachments")
          .getPublicUrl(filePath);

        attachmentUrl = publicUrl;
      }

      const { data, error: supabaseError } = await supabase
        .from("business_consultations")
        .insert([{ ...consultation, attachment_url: attachmentUrl }])
        .select();

      if (supabaseError) throw supabaseError;
      return { success: true, data };
    } catch (err: any) {
      console.error("Error submitting business consultation:", err);
      return { success: false, error: err.message };
    }
  };

  const respondToConsultation = async (
    id: string,
    response: string,
    status: BusinessConsultation["status"],
  ) => {
    try {
      const { error: supabaseError } = await supabase
        .from("business_consultations")
        .update({
          admin_response: response,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      return { success: true };
    } catch (err: any) {
      console.error("Error responding to business consultation:", err);
      return { success: false, error: err.message };
    }
  };

  return {
    advisors,
    consultations,
    loading,
    error,
    fetchAdvisors,
    fetchConsultations,
    addAdvisor,
    submitConsultation,
    respondToConsultation,
  };
};
