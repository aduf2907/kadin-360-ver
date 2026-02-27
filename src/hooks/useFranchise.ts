import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { FranchiseOpportunity } from "@/types";

export const useFranchises = () => {
  const [franchises, setFranchises] = useState<FranchiseOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("franchises")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      if (data) {
        const mappedData: FranchiseOpportunity[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          investment: item.investment,
          imageUrl:
            item.image_url ||
            `https://picsum.photos/seed/franchise${item.id}/400/200`,
          description: item.description,
          location: item.location,
          established: item.established,
          outlets: item.outlets,
          contact: {
            name: item.contact_name || "",
            email: item.contact_email || "",
            phone: item.contact_phone || "",
          },
        }));
        setFranchises(mappedData);
      }
    } catch (err: any) {
      console.error("Error fetching franchises:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addFranchise = async (franchise: Omit<FranchiseOpportunity, "id">) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("franchises")
        .insert([
          {
            name: franchise.name,
            category: franchise.category,
            investment: franchise.investment,
            image_url: franchise.imageUrl,
            description: franchise.description,
            location: franchise.location,
            established: franchise.established,
            outlets: franchise.outlets,
            contact_name: franchise.contact?.name,
            contact_email: franchise.contact?.email,
            contact_phone: franchise.contact?.phone,
          },
        ])
        .select();

      if (supabaseError) throw supabaseError;
      await fetchFranchises();
      return { success: true };
    } catch (err: any) {
      console.error("Error adding franchise:", err);
      return { success: false, error: err.message };
    }
  };

  const updateFranchise = async (
    id: string | number,
    franchise: Partial<FranchiseOpportunity>,
  ) => {
    try {
      const updateData: any = {
        name: franchise.name,
        category: franchise.category,
        investment: franchise.investment,
        image_url: franchise.imageUrl,
        description: franchise.description,
        location: franchise.location,
        established: franchise.established,
        outlets: franchise.outlets,
      };

      if (franchise.contact) {
        updateData.contact_name = franchise.contact.name;
        updateData.contact_email = franchise.contact.email;
        updateData.contact_phone = franchise.contact.phone;
      }

      const { error: supabaseError } = await supabase
        .from("franchises")
        .update(updateData)
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      await fetchFranchises();
      return { success: true };
    } catch (err: any) {
      console.error("Error updating franchise:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteFranchise = async (id: string | number) => {
    try {
      const { error: supabaseError } = await supabase
        .from("franchises")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      await fetchFranchises();
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting franchise:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchFranchises();
  }, []);

  return {
    franchises,
    loading,
    error,
    addFranchise,
    updateFranchise,
    deleteFranchise,
    refresh: fetchFranchises,
  };
};
