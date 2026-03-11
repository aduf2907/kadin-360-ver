import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { KadinDocument } from "@/types";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<KadinDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setDocuments(data || []);
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (
    file: File,
    title: string,
    description: string,
    userId: string,
  ) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // 1. Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      // 3. Insert into database
      const { data, error: dbError } = await supabase
        .from("documents")
        .insert([
          {
            title,
            description,
            file_url: publicUrl,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            uploaded_by: userId,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (dbError) throw dbError;

      setDocuments((prev) => [data[0], ...prev]);
      return { success: true };
    } catch (err: any) {
      console.error("Error uploading document:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteDocument = async (id: string, filePath: string) => {
    try {
      // 1. Delete from storage (need to extract path from URL or store it)
      // For simplicity, we'll just delete from DB in this example or assume we have the path
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting document:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    refresh: fetchDocuments,
  };
};
