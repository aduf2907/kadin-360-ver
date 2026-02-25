import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { NewsArticle } from "@/types";

export const useNews = (limit?: number) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching: ", error);
      } else {
        setNews(data ?? []);
      }

      setLoading(false);
    };
    fetchNews();
  }, [limit]);
  return { news, loading };
};
