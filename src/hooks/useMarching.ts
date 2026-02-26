import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { UserProfile } from "@/types";

export const useMatching = () => {
  const [partners, setPartners] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from("users")
          .select("*");

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          // Map database fields to UserProfile interface
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
            level: item.membership_type || "Active",
            membershipId: "KDN-" + item.id.substring(0, 8).toUpperCase(),
            validThru: item.valid_thru || "12/25",
            bonafidityStatus: item.bonafidity_status || "Green",
            rating: item.rating || 0,
            isAiRecommended: false,
            bio: item.bio,
          }));
          setPartners(mappedData);
        }
      } catch (err: any) {
        console.error("Error fetching matching partners:", err);
        setError(err.message || "Failed to fetch partners");

        // Fallback to mock data if database is empty or fails
        setPartners([
          {
            id: 1,
            name: "Citra Lestari",
            company: "Agro Makmur Sejahtera",
            role: "CEO",
            avatar: "https://picsum.photos/id/1011/200/200",
            industry: "Agriculture",
            region: "Surabaya",
            interests: ["export", "sustainability"],
            isAiRecommended: false,
            level: "Premium",
            membershipId: "KDN-87654321",
            validThru: "11/26",
            bonafidityStatus: "Green",
            rating: 95,
          },
          {
            id: 2,
            name: "Andi Wijaya",
            company: "PT. Maju Logistik",
            role: "Operations Manager",
            avatar: "https://picsum.photos/id/1027/200/200",
            industry: "Technology",
            region: "Jakarta",
            interests: ["supply chain", "iot"],
            isAiRecommended: false,
            level: "Verified",
            membershipId: "KDN-87654322",
            validThru: "10/25",
            bonafidityStatus: "Green",
            rating: 88,
          },
          {
            id: 3,
            name: "Rina Hartono",
            company: "Karya Manufaktur",
            role: "Director",
            avatar: "https://picsum.photos/id/1012/200/200",
            industry: "Manufacturing",
            region: "Bandung",
            interests: ["automation", "quality control"],
            isAiRecommended: false,
            level: "Active",
            membershipId: "KDN-87654323",
            validThru: "09/26",
            bonafidityStatus: "Yellow",
            rating: 72,
          },
          {
            id: 4,
            name: "David Lee",
            company: "Innovate Solutions",
            role: "CTO",
            avatar: "https://picsum.photos/id/1013/200/200",
            industry: "Technology",
            region: "International",
            interests: ["saas", "ai"],
            isAiRecommended: false,
            level: "Premium",
            membershipId: "KDN-87654324",
            validThru: "08/25",
            bonafidityStatus: "Green",
            rating: 98,
          },
          {
            id: 5,
            name: "Siti Aminah",
            company: "Green Energy Corp",
            role: "Founder",
            avatar: "https://picsum.photos/id/1014/200/200",
            industry: "Energy",
            region: "Jakarta",
            interests: ["renewable energy", "investment"],
            isAiRecommended: false,
            level: "Verified",
            membershipId: "KDN-87654325",
            validThru: "07/26",
            bonafidityStatus: "Green",
            rating: 90,
          },
          {
            id: 6,
            name: "Bambang Susilo",
            company: "Nusantara Foods",
            role: "Marketing Head",
            avatar: "https://picsum.photos/id/1015/200/200",
            industry: "F&B",
            region: "Surabaya",
            interests: ["branding", "digital marketing"],
            isAiRecommended: false,
            level: "Active",
            membershipId: "KDN-87654326",
            validThru: "06/25",
            bonafidityStatus: "Yellow",
            rating: 68,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return { partners, loading, error };
};
