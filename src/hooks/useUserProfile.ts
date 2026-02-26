import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { UserProfile } from "@/types";

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { profile, setProfile, loading };
};
