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
  const [showAddForm, setShowAddForm] = useState(false);

  // Form States
  const [marketInsights, setMarketInsights] = useState<any[]>([]);
  const [engagementStats, setEngagementStats] = useState<any[]>([]);
  const [industryTrends, setIndustryTrends] = useState<any[]>([]);

  // New Insight Form State
  const [newInsight, setNewInsight] = useState({
    title: "",
    category: "Technology",
    description: "",
    is_premium: false,
    image_url: "https://picsum.photos/seed/insight/800/400",
  });

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
        supabase.from("automated_engagement_stats").select("*"),
        supabase.from("automated_industry_trends").select("*"),
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

  const handleAddInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("market_insights")
        .insert([newInsight]);

      if (error) throw error;

      setMessage({ type: "success", text: "New insight added successfully!" });
      setShowAddForm(false);
      setNewInsight({
        title: "",
        category: "Technology",
        description: "",
        is_premium: false,
        image_url: "https://picsum.photos/seed/insight/800/400",
      });
      fetchData();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInsight = async (id: number) => {
    if (!confirm("Are you sure you want to delete this insight?")) return;

    try {
      const { error } = await supabase
        .from("market_insights")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setMessage({ type: "success", text: "Insight deleted!" });
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
                        <button
                          onClick={() => handleDeleteInsight(insight.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showAddForm ? (
              <div className="mt-6 bg-kadin-navy p-6 rounded-lg border border-kadin-gold/30">
                <h4 className="text-lg font-bold text-kadin-white mb-4">
                  Add New Market Insight
                </h4>
                <form onSubmit={handleAddInsight} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-kadin-light-slate mb-1">
                        Title
                      </label>
                      <input
                        required
                        type="text"
                        value={newInsight.title}
                        onChange={(e) =>
                          setNewInsight({
                            ...newInsight,
                            title: e.target.value,
                          })
                        }
                        className="w-full bg-kadin-light-navy border border-gray-600 rounded px-3 py-2 text-sm text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-kadin-light-slate mb-1">
                        Category
                      </label>
                      <select
                        value={newInsight.category}
                        onChange={(e) =>
                          setNewInsight({
                            ...newInsight,
                            category: e.target.value,
                          })
                        }
                        className="w-full bg-kadin-light-navy border border-gray-600 rounded px-3 py-2 text-sm text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                      >
                        <option>Technology</option>
                        <option>Agriculture</option>
                        <option>Manufacturing</option>
                        <option>F&B</option>
                        <option>Finance</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-kadin-light-slate mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      value={newInsight.description}
                      onChange={(e) =>
                        setNewInsight({
                          ...newInsight,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full bg-kadin-light-navy border border-gray-600 rounded px-3 py-2 text-sm text-kadin-white focus:ring-1 focus:ring-kadin-gold outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newInsight.is_premium}
                        onChange={(e) =>
                          setNewInsight({
                            ...newInsight,
                            is_premium: e.target.checked,
                          })
                        }
                        className="form-checkbox h-4 w-4 text-kadin-gold rounded bg-kadin-light-navy border-gray-600"
                      />
                      <span className="text-sm text-kadin-light-slate">
                        Premium Content
                      </span>
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-kadin-gold text-kadin-navy px-6 py-2 rounded font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Insight"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-600 text-kadin-white px-6 py-2 rounded font-bold hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-kadin-gold text-kadin-navy px-4 py-2 rounded font-bold hover:bg-yellow-400 transition-colors"
              >
                Add New Insight
              </button>
            )}
          </div>
        )}

        {activeTab === "engagement" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-kadin-white">
                Platform Engagement
              </h3>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                Automated Sync
              </span>
            </div>
            <p className="text-sm text-kadin-slate">
              Data is automatically aggregated from user activity and messaging
              tables.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {engagementStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-kadin-navy p-4 rounded-lg border border-gray-700"
                >
                  <h4 className="font-bold text-kadin-gold mb-3">
                    {stat.month} (Real-time)
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-kadin-slate">
                        Total Members
                      </span>
                      <span className="text-lg font-bold text-kadin-white">
                        {stat.active_members}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-kadin-slate">
                        Messages Exchanged
                      </span>
                      <span className="text-lg font-bold text-kadin-white">
                        {stat.messages_sent}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "trends" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-kadin-white">
                Industry Distribution
              </h3>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                Automated Sync
              </span>
            </div>
            <p className="text-sm text-kadin-slate">
              Real-time distribution of industries based on member profiles.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industryTrends.map((trend, idx) => (
                <div
                  key={idx}
                  className="bg-kadin-navy p-6 rounded-lg border border-gray-700"
                >
                  <h4 className="font-bold text-kadin-gold mb-4">
                    Member Industry Mix
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-kadin-light-slate">Technology</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-full"
                            style={{
                              width: `${(trend.technology / (trend.technology + trend.agriculture + trend.manufacturing || 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-kadin-white font-bold">
                          {trend.technology}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-kadin-light-slate">
                        Agriculture
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 h-full"
                            style={{
                              width: `${(trend.agriculture / (trend.technology + trend.agriculture + trend.manufacturing || 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-kadin-white font-bold">
                          {trend.agriculture}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-kadin-light-slate">
                        Manufacturing
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-orange-500 h-full"
                            style={{
                              width: `${(trend.manufacturing / (trend.technology + trend.agriculture + trend.manufacturing || 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-kadin-white font-bold">
                          {trend.manufacturing}
                        </span>
                      </div>
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
