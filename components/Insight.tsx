import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Transaction, MarketInsight, UserProfile } from "../types";
import { useInsights } from "@/src/hooks/useInsight";

interface InsightProps {
  user: UserProfile;
}

const engagementData = [
  { name: "Jan", activeMembers: 400, messages: 2400 },
  { name: "Feb", activeMembers: 300, messages: 1398 },
  { name: "Mar", activeMembers: 500, messages: 9800 },
  { name: "Apr", activeMembers: 478, messages: 3908 },
  { name: "May", activeMembers: 589, messages: 4800 },
  { name: "Jun", activeMembers: 439, messages: 3800 },
];

const trendData = [
  { name: "Q1", Technology: 40, Agriculture: 24, Manufacturing: 14 },
  { name: "Q2", Technology: 30, Agriculture: 13, Manufacturing: 22 },
  { name: "Q3", Technology: 50, Agriculture: 48, Manufacturing: 20 },
  { name: "Q4", Technology: 47, Agriculture: 39, Manufacturing: 29 },
];

const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <div
    className={`bg-kadin-light-navy p-6 rounded-lg border border-gray-700 ${className}`}
  >
    <h3 className="text-xl font-bold text-kadin-white mb-4">{title}</h3>
    <div style={{ width: "100%", height: 300 }}>{children}</div>
  </div>
);

const statusColors: { [key in Transaction["status"]]: string } = {
  Completed: "bg-green-500/10 text-green-400",
  Pending: "bg-yellow-500/10 text-yellow-400",
  Failed: "bg-red-500/10 text-red-400",
};

const Insight: React.FC<InsightProps> = ({ user }) => {
  const {
    fetchTransactions,
    fetchMarketInsights,
    fetchEngagementStats,
    fetchIndustryTrends,
    transactions,
    marketInsights,
    engagementStats,
    industryTrends,
    loading,
  } = useInsights();

  useEffect(() => {
    if (user?.id) {
      fetchTransactions(user.id);
      fetchMarketInsights();
      fetchEngagementStats();
      fetchIndustryTrends();
    }
  }, [user?.id]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-kadin-white">
        Insights & Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Member Engagement">
          <ResponsiveContainer>
            <BarChart
              data={
                engagementStats.length > 0 ? engagementStats : engagementData
              }
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis
                dataKey={engagementStats.length > 0 ? "month" : "name"}
                stroke="#a8b2d1"
              />
              <YAxis stroke="#a8b2d1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#172A45",
                  border: "1px solid #4A5568",
                }}
              />
              <Legend />
              <Bar
                dataKey={
                  engagementStats.length > 0
                    ? "active_members"
                    : "activeMembers"
                }
                fill="#D4AF37"
                name="Active Members"
              />
              <Bar
                dataKey={
                  engagementStats.length > 0 ? "messages_sent" : "messages"
                }
                fill="#4299E1"
                name="Messages Sent"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Business Matching Trends by Industry">
          <ResponsiveContainer>
            <LineChart
              data={industryTrends.length > 0 ? industryTrends : trendData}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis
                dataKey={industryTrends.length > 0 ? "period" : "name"}
                stroke="#a8b2d1"
              />
              <YAxis stroke="#a8b2d1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#172A45",
                  border: "1px solid #4A5568",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={
                  industryTrends.length > 0 ? "technology" : "Technology"
                }
                stroke="#D4AF37"
                name="Technology"
              />
              <Line
                type="monotone"
                dataKey={
                  industryTrends.length > 0 ? "agriculture" : "Agriculture"
                }
                stroke="#38B2AC"
                name="Agriculture"
              />
              <Line
                type="monotone"
                dataKey={
                  industryTrends.length > 0 ? "manufacturing" : "Manufacturing"
                }
                stroke="#9F7AEA"
                name="Manufacturing"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="lg:col-span-2">
          <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-kadin-white mb-6">
              Market Intelligence & Trends
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketInsights.length > 0 ? (
                marketInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="bg-kadin-navy p-4 rounded-lg border border-gray-700 hover:border-kadin-gold transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-kadin-gold bg-kadin-gold/10 px-2 py-0.5 rounded">
                        {insight.category}
                      </span>
                      {insight.is_premium && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                          Premium
                        </span>
                      )}
                    </div>
                    <h4 className="text-kadin-white font-bold mb-2 group-hover:text-kadin-gold transition-colors">
                      {insight.title}
                    </h4>
                    <p className="text-kadin-slate text-xs line-clamp-3">
                      {insight.description || insight.summary}
                    </p>
                    <div className="mt-4 text-[10px] text-kadin-light-slate">
                      {new Date(insight.created_at).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-kadin-slate italic">
                  No market insights available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-kadin-white mb-4">
              Transaction History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-kadin-slate">
                <thead className="text-xs text-kadin-light-slate uppercase bg-kadin-navy">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      Amount (IDR)
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-gray-700 hover:bg-kadin-navy"
                      >
                        <td className="px-6 py-4 font-medium text-kadin-white whitespace-nowrap">
                          {tx.date}
                        </td>
                        <td className="px-6 py-4">{tx.description}</td>
                        <td className="px-6 py-4 text-right font-medium text-kadin-white">
                          {tx.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[tx.status]}`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-kadin-slate italic"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insight;
