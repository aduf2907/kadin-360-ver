import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { UserProfile } from "@/types";

export const useMembers = () => {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from("users")
          .select("*");

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          const mappedData: UserProfile[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            company: item.company || "KADIN Member",
            role: item.role || "Entrepreneur",
            avatar:
              item.avatar_url ||
              `https://picsum.photos/seed/${item.id}/200/200`,
            industry: item.industry || "General",
            region: item.region || "Jakarta",
            interests: item.interests || [],
            membership_type: item.membership_type || "Active",
            level: item.membership_type || "Active",
            membershipId: "KDN-" + item.id.substring(0, 8).toUpperCase(),
            validThru: item.valid_thru || "12/25",
            bonafidityStatus: item.bonafidity_status || "Green",
            rating: item.rating || 0,
            isAiRecommended: false,
            bio: item.bio,
          }));
          setMembers(mappedData);
        }
      } catch (err: any) {
        console.error("Error fetching members:", err);
        setError(err.message || "Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return { members, loading, error };
};
