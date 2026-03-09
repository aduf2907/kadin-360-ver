import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import supabase from "@/src/supabase-client";

interface InsightManagementProps {
  user: UserProfile | undefined;
}

const InsightManagement: React.FC<InsightManagementProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<
    "market" | "engagement" | "trends"
  >("market");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form States
  const [marketInsights, setMarketInsights] = useState<any[]>([]);
  const [engagementStats, setEngagementStats] = useState<any[]>([]);
  const [industryTrends, setIndustryTrends] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [marketRes, engagementRes, trendsRes] = await Promise.all([
        supabase
          .from("market_insights")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("engagement_stats")
          .select("*")
          .order("id", { ascending: true }),
        supabase
          .from("industry_trends")
          .select("*")
          .order("id", { ascending: true }),
      ]);

      if (marketRes.data) setMarketInsights(marketRes.data);
      if (engagementRes.data) setEngagementStats(engagementRes.data);
      if (trendsRes.data) setIndustryTrends(trendsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEngagement = async (
    id: number,
    field: string,
    value: any,
  ) => {
    try {
      const { error } = await supabase
        .from("engagement_stats")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;
      setMessage({ type: "success", text: "Engagement stats updated!" });
      fetchData();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleUpdateTrends = async (id: number, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from("industry_trends")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;
      setMessage({ type: "success", text: "Industry trends updated!" });
      fetchData();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p className="text-kadin-slate">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-kadin-white">
          Insight Management
        </h2>
        {message && (
          <div
            className={`px-4 py-2 rounded ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
          >
            {message.text}
          </div>
        )}
      </div>

      <div className="flex space-x-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("market")}
          className={`pb-2 px-4 font-bold transition-colors ${activeTab === "market" ? "text-kadin-gold border-b-2 border-kadin-gold" : "text-kadin-slate hover:text-kadin-white"}`}
        >
          Market Intelligence
        </button>
        <button
          onClick={() => setActiveTab("engagement")}
          className={`pb-2 px-4 font-bold transition-colors ${activeTab === "engagement" ? "text-kadin-gold border-b-2 border-kadin-gold" : "text-kadin-slate hover:text-kadin-white"}`}
        >
          Engagement Stats
        </button>
        <button
          onClick={() => setActiveTab("trends")}
          className={`pb-2 px-4 font-bold transition-colors ${activeTab === "trends" ? "text-kadin-gold border-b-2 border-kadin-gold" : "text-kadin-slate hover:text-kadin-white"}`}
        >
          Industry Trends
        </button>
      </div>

      <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
        {activeTab === "market" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-kadin-white">
              Manage Market Insights
            </h3>
            <p className="text-sm text-kadin-slate mb-4">
              Add or edit market intelligence reports.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-kadin-slate">
                <thead className="bg-kadin-navy text-kadin-light-slate uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Premium</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {marketInsights.map((insight) => (
                    <tr key={insight.id} className="border-b border-gray-700">
                      <td className="px-4 py-3 text-kadin-white font-medium">
                        {insight.title}
                      </td>
                      <td className="px-4 py-3">{insight.category}</td>
                      <td className="px-4 py-3">
                        {insight.is_premium ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-kadin-gold hover:underline">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-4 bg-kadin-gold text-kadin-navy px-4 py-2 rounded font-bold hover:bg-yellow-400 transition-colors">
              Add New Insight
            </button>
          </div>
        )}

        {activeTab === "engagement" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-kadin-white">
              Manage Engagement Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {engagementStats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-kadin-navy p-4 rounded-lg border border-gray-700"
                >
                  <h4 className="font-bold text-kadin-gold mb-3">
                    {stat.month}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-kadin-slate mb-1">
                        Active Members
                      </label>
                      <input
                        type="number"
                        value={stat.active_members}
                        onChange={(e) =>
                          handleUpdateEngagement(
                            stat.id,
                            "active_members",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full bg-kadin-light-navy border border-gray-600 rounded px-2 py-1 text-sm text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-kadin-slate mb-1">
                        Messages Sent
                      </label>
                      <input
                        type="number"
                        value={stat.messages_sent}
                        onChange={(e) =>
                          handleUpdateEngagement(
                            stat.id,
                            "messages_sent",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full bg-kadin-light-navy border border-gray-600 rounded px-2 py-1 text-sm text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "trends" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-kadin-white">
              Manage Industry Trends
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industryTrends.map((trend) => (
                <div
                  key={trend.id}
                  className="bg-kadin-navy p-4 rounded-lg border border-gray-700"
                >
                  <h4 className="font-bold text-kadin-gold mb-3">
                    {trend.period}
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-kadin-slate mb-1">
                        Tech
                      </label>
                      <input
                        type="number"
                        value={trend.technology}
                        onChange={(e) =>
                          handleUpdateTrends(
                            trend.id,
                            "technology",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full bg-kadin-light-navy border border-gray-600 rounded px-2 py-1 text-sm text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-kadin-slate mb-1">
                        Agri
                      </label>
                      <input
                        type="number"
                        value={trend.agriculture}
                        onChange={(e) =>
                          handleUpdateTrends(
                            trend.id,
                            "agriculture",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full bg-kadin-light-navy border border-gray-600 rounded px-2 py-1 text-sm text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-kadin-slate mb-1">
                        Manuf
                      </label>
                      <input
                        type="number"
                        value={trend.manufacturing}
                        onChange={(e) =>
                          handleUpdateTrends(
                            trend.id,
                            "manufacturing",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full bg-kadin-light-navy border border-gray-600 rounded px-2 py-1 text-sm text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightManagement;
