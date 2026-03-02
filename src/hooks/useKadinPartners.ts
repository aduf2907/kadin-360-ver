import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { KadinPartner } from "@/types";

export const useKadinPartners = () => {
  const [partners, setPartners] = useState<KadinPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("kadin_partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      if (data) {
        const mappedData: KadinPartner[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          logoUrl:
            item.logo_url ||
            `https://picsum.photos/seed/partner${item.id}/200/200`,
          description: item.description,
          offer: item.offer,
          about: item.about,
          services: item.services || [],
          targetIndustries: item.target_industries || [],
          contact: {
            email: item.contact_email || "",
            phone: item.contact_phone || "",
            website: item.contact_website || "",
          },
        }));
        setPartners(mappedData);
      }
    } catch (err: any) {
      console.error("Error fetching partners:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPartner = async (partner: Omit<KadinPartner, "id">) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("kadin_partners")
        .insert([
          {
            name: partner.name,
            category: partner.category,
            logo_url: partner.logoUrl,
            description: partner.description,
            offer: partner.offer,
            about: partner.about,
            services: partner.services,
            target_industries: partner.targetIndustries,
            contact_email: partner.contact.email,
            contact_phone: partner.contact.phone,
            contact_website: partner.contact.website,
          },
        ])
        .select();

      if (supabaseError) throw supabaseError;
      await fetchPartners();
      return { success: true };
    } catch (err: any) {
      console.error("Error adding partner:", err);
      return { success: false, error: err.message };
    }
  };

  const updatePartner = async (
    id: string | number,
    partner: Partial<KadinPartner>,
  ) => {
    try {
      const updateData: any = {
        name: partner.name,
        category: partner.category,
        logo_url: partner.logoUrl,
        description: partner.description,
        offer: partner.offer,
        about: partner.about,
        services: partner.services,
        target_industries: partner.targetIndustries,
      };

      if (partner.contact) {
        updateData.contact_email = partner.contact.email;
        updateData.contact_phone = partner.contact.phone;
        updateData.contact_website = partner.contact.website;
      }

      const { error: supabaseError } = await supabase
        .from("kadin_partners")
        .update(updateData)
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      await fetchPartners();
      return { success: true };
    } catch (err: any) {
      console.error("Error updating partner:", err);
      return { success: false, error: err.message };
    }
  };

  const deletePartner = async (id: string | number) => {
    try {
      const { error: supabaseError } = await supabase
        .from("kadin_partners")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      await fetchPartners();
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting partner:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners,
    loading,
    error,
    addPartner,
    updatePartner,
    deletePartner,
    refresh: fetchPartners,
  };
};
