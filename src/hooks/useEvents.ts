import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { KadinEvent } from "@/types";

export const useEvents = (limit?: number) => {
  const [events, setEvents] = useState<KadinEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching: ", error);
      } else {
        setEvents(data ?? []);
      }

      setLoading(false);
    };
    fetchEvents();
  }, [limit]);
  return { events, loading };
};
