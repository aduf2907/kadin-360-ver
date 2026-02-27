import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { UserProfile } from "@/types";

export const useMatching = () => {
  const [partners, setPartners] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("users")
        .select("*");

      if (supabaseError) {
        throw supabaseError;
      }
    };
    fetchPartners();
  }, []);

  return { partners, loading, error };
};
