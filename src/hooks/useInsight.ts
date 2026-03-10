import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { Transaction, MarketInsight } from "@/types";

export const useInsights = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  const [engagementStats, setEngagementStats] = useState<any[]>([]);
  const [industryTrends, setIndustryTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (userId: string | number) => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      // Map created_at to date for UI compatibility
      const mappedData = (data || []).map((tx) => ({
        ...tx,
        date: new Date(tx.created_at).toLocaleDateString("id-ID"),
      }));

      setTransactions(mappedData);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketInsights = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("market_insights")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setMarketInsights(data || []);
    } catch (err: any) {
      console.error("Error fetching market insights:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEngagementStats = async () => {
    try {
      const { data, error } = await supabase
        .from("automated_engagement_stats")
        .select("*");
      if (error) throw error;
      setEngagementStats(data || []);
    } catch (err) {
      console.error("Error fetching engagement stats:", err);
    }
  };

  const fetchIndustryTrends = async () => {
    try {
      const { data, error } = await supabase
        .from("automated_industry_trends")
        .select("*");
      if (error) throw error;
      setIndustryTrends(data || []);
    } catch (err) {
      console.error("Error fetching industry trends:", err);
    }
  };

  const logAnalyticsEvent = async (
    userId: string | number,
    eventType: string,
    metadata: any = {},
  ) => {
    try {
      await supabase.from("analytics_events").insert([
        {
          user_id: userId,
          event_type: eventType,
          metadata,
        },
      ]);
    } catch (err) {
      console.error("Error logging analytics event:", err);
    }
  };

  return {
    transactions,
    marketInsights,
    engagementStats,
    industryTrends,
    loading,
    error,
    fetchTransactions,
    fetchMarketInsights,
    fetchEngagementStats,
    fetchIndustryTrends,
    logAnalyticsEvent,
  };
};
