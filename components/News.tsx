import React, { useState, useEffect } from "react";
import NewsIcon from "./icons/NewsIcon";
import { NewsArticle } from "../types";
import { useNews } from "@/src/hooks/useNews";

const NewsPage: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { news, loading } = useNews();

  const categories = [
    "All",
    "Press Release",
    "Market Insight",
    "Event",
    "Regulation",
  ];

  // 🔎 Filter Logic
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredNews = news[0];

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-kadin-white mb-6 flex items-center gap-3">
        <NewsIcon className="h-8 w-8 text-kadin-gold" />
        News & Updates
      </h2>

      {/* 🔍 Filter & Search */}
      <div className="bg-kadin-light-navy/50 p-4 rounded-xl border border-gray-700 mb-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <input
            type="text"
            placeholder="Search news articles..."
            className="w-full bg-kadin-navy border border-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm text-kadin-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-kadin-gold text-kadin-navy"
                  : "bg-kadin-navy text-kadin-slate border border-gray-700 hover:border-kadin-gold/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 📰 News Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <div
                key={item.id}
                className="bg-kadin-light-navy rounded-xl border border-gray-700 overflow-hidden flex flex-col transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer hover:border-kadin-gold/30 shadow-lg"
                onClick={() => setSelectedNews(item)}
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-kadin-navy/80 text-kadin-gold text-[10px] font-bold px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between text-[10px] font-bold text-kadin-slate uppercase tracking-widest mb-3">
                    <span>
                      {new Date(item.published_at).toLocaleDateString()}
                    </span>
                    <span>{item.category}</span>
                  </div>

                  <h4 className="text-xl font-bold text-kadin-white mb-3 group-hover:text-kadin-gold transition-colors line-clamp-2">
                    {item.title}
                  </h4>

                  <p className="text-kadin-slate text-sm line-clamp-3 mb-6 leading-relaxed">
                    {item.excerpt}
                  </p>

                  <div className="mt-auto text-kadin-gold font-bold text-sm">
                    Read More →
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-kadin-slate italic">
                Tidak ada berita yang ditemukan.
              </p>
            </div>
          )}
        </div>
      )}
      {/* 📰 Modal Detail News */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-kadin-light-navy w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 text-kadin-slate hover:text-kadin-gold text-xl font-bold z-10"
            >
              ✕
            </button>

            {/* Image */}
            <div className="h-64 overflow-hidden">
              <img
                src={selectedNews.image_url}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-kadin-white mb-3">
                {selectedNews.title}
              </h2>

              <div className="flex items-center gap-4 text-sm text-kadin-slate mb-6">
                <span>
                  {new Date(selectedNews.published_at).toLocaleDateString()}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                <span>{selectedNews.category}</span>
              </div>

              <p className="text-kadin-light-slate leading-relaxed whitespace-pre-line">
                {selectedNews.excerpt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
