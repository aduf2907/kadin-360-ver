import React, { useState, useEffect } from "react";
import { Page, NewsArticle, DiscussionThread } from "../types";
import CommunicationIcon from "./icons/CommunicationIcon";
import KnowledgeIcon from "./icons/KnowledgeIcon";
import MatchingIcon from "./icons/MatchingIcon";
import ExperienceIcon from "./icons/ExperienceIcon";
import CommunityIcon from "./icons/CommunityIcon";
import MyStoryIcon from "./icons/MyStoryIcon";
import FranchiseIcon from "./icons/FranchiseIcon";
import SecretariatIcon from "./icons/SecretariatIcon";
import KADINersRoomsIcon from "./icons/KADINersRoomsIcon";
import NewsIcon from "./icons/NewsIcon";
import MitraIcon from "./icons/MitraIcon";
import { useNews } from "@/src/hooks/useNews";

interface BerandaProps {
  setCurrentPage: (page: Page) => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <div
    className="bg-kadin-navy/50 p-6 rounded-xl border border-gray-700/50 text-center transform hover:-translate-y-1 transition-all duration-300 h-full flex flex-col z-10 cursor-pointer group hover:border-kadin-gold/50 shadow-md"
    onClick={onClick}
  >
    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-kadin-navy mx-auto mb-5 border-2 border-kadin-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-kadin-white mb-2 transition-colors duration-200 group-hover:text-kadin-gold">
      {title}
    </h3>
    <p className="text-kadin-slate text-xs leading-relaxed flex-grow">
      {description}
    </p>
  </div>
);

const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: "KADIN Partners with Government on New Digital Economy Initiative",
    category: "Press Release",
    summary: "",
    date: "Oct 25, 2024",
  },
  {
    id: 2,
    title: "Market Update: Manufacturing Sector Shows 5% Growth in Q3",
    category: "Market Insight",
    summary: "",
    date: "Oct 22, 2024",
  },
  {
    id: 3,
    title: "Registration Open for the Annual KADIN National Conference 2024",
    category: "Event",
    summary: "",
    date: "Oct 20, 2024",
  },
];

const mockThreads: DiscussionThread[] = [
  {
    id: 1,
    title: "Regulatory Update: New Export Tax Policy",
    category: "Investment & Policy",
    author: "Rina Hartono",
    authorAvatar: "https://picsum.photos/id/1012/40/40",
    replies: 15,
    lastActivity: "2h ago",
  },
  {
    id: 2,
    title: "Opportunities in the Renewable Energy Sector",
    category: "Energy & Resources",
    author: "Admin",
    authorAvatar: "https://picsum.photos/id/1/40/40",
    replies: 8,
    lastActivity: "5h ago",
  },
  {
    id: 3,
    title: "Best Practices for Digital Marketing in B2B",
    category: "Marketing",
    author: "Bambang Susilo",
    authorAvatar: "https://picsum.photos/id/1015/40/40",
    replies: 22,
    lastActivity: "1d ago",
  },
];

const heroCarouselImages = [
  "https://arkdesign-architects.com/wp-content/uploads/2021/12/Menara-Kadin-Office-1.jpg",
  "https://picsum.photos/seed/tech/1200/600",
  "https://picsum.photos/seed/globalbusiness/1200/600",
  "https://picsum.photos/seed/innovation/1200/600",
];

const featureCarouselImages = [
  "https://picsum.photos/seed/collaboration/1200/400",
  "https://picsum.photos/seed/knowledgehub/1200/400",
  "https://picsum.photos/seed/matchingai/1200/400",
  "https://picsum.photos/seed/community/1200/400",
];

const heroContent = [
  {
    tag: "OFFICIAL MEMBER PLATFORM",
    title: (
      <>
        Selamat Datang di <br />
        <span className="text-kadin-gold">KADIN 360</span>
      </>
    ),
    subtitle:
      "Platform terintegrasi untuk komunikasi, berbagi pengetahuan, dan business matching eksklusif bagi anggota KADIN Indonesia.",
  },
  {
    tag: "AI POWERED MATCHING",
    title: (
      <>
        Temukan <span className="text-kadin-gold">Peluang Bisnis</span> <br />
        Tanpa Batas
      </>
    ),
    subtitle:
      "Akses fitur Business Matching dengan rekomendasi AI untuk menemukan mitra yang paling sesuai dengan profil bisnis Anda.",
  },
  {
    tag: "NETWORKING",
    title: (
      <>
        Perluas Jaringan & <br />
        <span className="text-kadin-gold">Kolaborasi Global</span>
      </>
    ),
    subtitle:
      "Terhubung dengan para pemimpin industri dan sesama anggota melalui forum diskusi, komunitas, dan acara eksklusif.",
  },
  {
    tag: "KNOWLEDGE HUB",
    title: (
      <>
        Tingkatkan Wawasan, <br />
        <span className="text-kadin-gold">Kembangkan Bisnis</span>
      </>
    ),
    subtitle:
      "Manfaatkan pusat pengetahuan kami yang berisi e-learning, artikel, dan wawasan pasar terkini untuk pertumbuhan bisnis Anda.",
  },
];

const animatedSubtitles = [
  "Komunikasi & Kolaborasi",
  "Pusat Pengetahuan",
  "Business Matching",
  "KADINers Rooms",
  "Experience Sharing",
  "Peluang Franchise",
];

const Beranda: React.FC<BerandaProps> = ({ setCurrentPage }) => {
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [currentFeatureImageIndex, setCurrentFeatureImageIndex] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [heroAnimationState, setHeroAnimationState] = useState<
    "enter" | "exit"
  >("enter");
  const { news, loading } = useNews(3);

  useEffect(() => {
    const heroImageInterval = setInterval(() => {
      setHeroAnimationState("exit");
      setTimeout(() => {
        setCurrentHeroImageIndex(
          (prevIndex) => (prevIndex + 1) % heroCarouselImages.length,
        );
        setCurrentHeroIndex(
          (prevIndex) => (prevIndex + 1) % heroContent.length,
        );
        setHeroAnimationState("enter");
      }, 500);
    }, 6000);

    const featureImageInterval = setInterval(() => {
      setCurrentFeatureImageIndex(
        (prevIndex) => (prevIndex + 1) % featureCarouselImages.length,
      );
    }, 5000);

    return () => {
      clearInterval(heroImageInterval);
      clearInterval(featureImageInterval);
    };
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = animatedSubtitles[subtitleIndex];
      if (isDeleting) {
        if (displayedSubtitle === "") {
          setIsDeleting(false);
          setSubtitleIndex((prev) => (prev + 1) % animatedSubtitles.length);
        } else {
          setDisplayedSubtitle(
            fullText.substring(0, displayedSubtitle.length - 1),
          );
          setTypingSpeed(100);
        }
      } else {
        if (displayedSubtitle === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else {
          setDisplayedSubtitle(
            fullText.substring(0, displayedSubtitle.length + 1),
          );
          setTypingSpeed(150);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, [displayedSubtitle, isDeleting, subtitleIndex, typingSpeed]);

  const goToPreviousHero = () => {
    setHeroAnimationState("exit");
    setTimeout(() => {
      const isFirstSlide = currentHeroImageIndex === 0;
      const newIndex = isFirstSlide
        ? heroCarouselImages.length - 1
        : currentHeroImageIndex - 1;
      setCurrentHeroImageIndex(newIndex);
      setCurrentHeroIndex(newIndex);
      setHeroAnimationState("enter");
    }, 300);
  };
  const goToNextHero = () => {
    setHeroAnimationState("exit");
    setTimeout(() => {
      const isLastSlide =
        currentHeroImageIndex === heroCarouselImages.length - 1;
      const newIndex = isLastSlide ? 0 : currentHeroImageIndex + 1;
      setCurrentHeroImageIndex(newIndex);
      setCurrentHeroIndex(newIndex);
      setHeroAnimationState("enter");
    }, 300);
  };
  const goToHeroSlide = (slideIndex: number) => {
    if (slideIndex === currentHeroImageIndex) return;
    setHeroAnimationState("exit");
    setTimeout(() => {
      setCurrentHeroImageIndex(slideIndex);
      setCurrentHeroIndex(slideIndex);
      setHeroAnimationState("enter");
    }, 300);
  };

  const goToPreviousFeature = () => {
    const isFirstSlide = currentFeatureImageIndex === 0;
    const newIndex = isFirstSlide
      ? featureCarouselImages.length - 1
      : currentFeatureImageIndex - 1;
    setCurrentFeatureImageIndex(newIndex);
  };
  const goToNextFeature = () => {
    const isLastSlide =
      currentFeatureImageIndex === featureCarouselImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentFeatureImageIndex + 1;
    setCurrentFeatureImageIndex(newIndex);
  };
  const goToFeatureSlide = (slideIndex: number) => {
    setCurrentFeatureImageIndex(slideIndex);
  };

  return (
    <div className="text-center pb-12">
      {/* Hero Section */}
      <div className="relative h-[480px] w-full overflow-hidden rounded-xl shadow-xl group">
        {heroCarouselImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <img
              src={src}
              alt="Hero Background"
              className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${index === currentHeroImageIndex ? "scale-110" : "scale-100"}`}
            />
          </div>
        ))}

        <div className="absolute inset-0 z-20 bg-gradient-to-r from-kadin-navy via-kadin-navy/85 to-transparent/20"></div>

        <div className="relative z-30 h-full flex flex-col justify-center px-6 md:px-12 lg:px-16">
          <div
            className={`text-left max-w-2xl transition-all duration-500 ease-out transform ${heroAnimationState === "enter" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <div className="inline-flex items-center space-x-2 bg-kadin-gold/10 border border-kadin-gold/30 rounded-full px-3 py-1 mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-kadin-gold animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest text-kadin-gold uppercase">
                {heroContent[currentHeroIndex].tag}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-kadin-white leading-tight mb-3 drop-shadow-lg">
              {heroContent[currentHeroIndex].title}
            </h1>

            <p className="text-base text-kadin-light-slate mb-6 leading-relaxed max-w-lg border-l-4 border-kadin-gold pl-4 bg-gradient-to-r from-kadin-gold/10 to-transparent py-1">
              {heroContent[currentHeroIndex].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://kadin-membership.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-kadin-gold text-kadin-navy font-bold rounded-lg shadow hover:bg-yellow-400 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-sm"
              >
                Gabung Sekarang
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <button
                onClick={() => setCurrentPage("Login")}
                className="px-6 py-3 bg-transparent border-2 border-kadin-slate text-kadin-white font-bold rounded-lg hover:border-kadin-white hover:bg-white/5 transition-colors flex items-center justify-center text-sm"
              >
                Jelajahi Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 md:left-12 lg:left-16 z-30 flex items-center space-x-2">
          {heroCarouselImages.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToHeroSlide(slideIndex)}
              className={`cursor-pointer h-1 rounded-full transition-all duration-500 ease-out ${currentHeroImageIndex === slideIndex ? "w-8 bg-kadin-gold" : "w-2 bg-gray-600 hover:bg-gray-400"}`}
            ></div>
          ))}
        </div>
      </div>

      {/* Features Section Container */}
      <div className="mt-12 max-w-7xl mx-auto px-6 text-left">
        {/* Visual Header Banner */}
        <div className="relative rounded-xl overflow-hidden py-10 mb-6 group shadow-lg">
          {featureCarouselImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt="Feature background"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentFeatureImageIndex ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-kadin-navy/85"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-kadin-white">
              Fitur Unggulan Kami
            </h2>
            <div className="mt-3 text-kadin-gold text-lg md:text-xl font-mono h-6 flex items-center justify-center">
              <span>{displayedSubtitle}</span>
              <span className="w-0.5 h-6 bg-kadin-gold ml-2 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Feature Content Wrapper (Similar to News Blocks) */}
        <div className="bg-kadin-light-navy/40 p-8 rounded-2xl border border-gray-700 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <FeatureCard
              icon={<CommunicationIcon className="h-7 w-7 text-kadin-gold" />}
              title="Komunikasi"
              description="Terhubung langsung dengan sesama anggota melalui chat dan forum."
              onClick={() => setCurrentPage("Communication")}
            />
            <FeatureCard
              icon={<KADINersRoomsIcon className="h-7 w-7 text-kadin-gold" />}
              title="KADINers Rooms"
              description="Diskusi forum eksklusif untuk berbagi wawasan."
              onClick={() => setCurrentPage("KADINers Rooms")}
            />
            <FeatureCard
              icon={<KnowledgeIcon className="h-7 w-7 text-kadin-gold" />}
              title="Pusat Pengetahuan"
              description="Akses e-learning dan regulasi terbaru untuk bisnis."
              onClick={() => setCurrentPage("Knowledge")}
            />
            <FeatureCard
              icon={<MatchingIcon className="h-7 w-7 text-kadin-gold" />}
              title="Business Matching"
              description="Temukan mitra bisnis potensial dengan rekomendasi AI."
              onClick={() => setCurrentPage("Matching")}
            />
            <FeatureCard
              icon={<ExperienceIcon className="h-7 w-7 text-kadin-gold" />}
              title="Experience"
              description="Bagikan pengalaman event dan perjalanan bisnis."
              onClick={() => setCurrentPage("Experience")}
            />
            <FeatureCard
              icon={<CommunityIcon className="h-7 w-7 text-kadin-gold" />}
              title="Community"
              description="Bergabung dalam grup minat dan komunitas regional."
              onClick={() => setCurrentPage("Community")}
            />
            <FeatureCard
              icon={<MyStoryIcon className="h-7 w-7 text-kadin-gold" />}
              title="My Story"
              description="Inspirasi dari kisah sukses anggota KADIN."
              onClick={() => setCurrentPage("My Story")}
            />
            <FeatureCard
              icon={<FranchiseIcon className="h-7 w-7 text-kadin-gold" />}
              title="Franchise"
              description="Jelajahi direktori peluang waralaba terbaik."
              onClick={() => setCurrentPage("Franchise")}
            />
            <FeatureCard
              icon={<SecretariatIcon className="h-7 w-7 text-kadin-gold" />}
              title="Sekretariat"
              description="Administrasi bergabung di Kadin 360."
              onClick={() => setCurrentPage("Secretariat")}
            />
            <FeatureCard
              icon={<MitraIcon className="h-7 w-7 text-kadin-gold" />}
              title="Mitra KADIN"
              description="Direktori mitra penyedia layanan operasional."
              onClick={() => setCurrentPage("Mitra KADIN")}
            />
          </div>
        </div>
      </div>

      {/* News and Forum Section */}
      <div className="mt-12 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-kadin-white mb-6 text-left border-l-4 border-kadin-gold pl-4">
          Aktivitas Terkini
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          {/* KADIN News */}
          <div
            className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700 cursor-pointer hover:border-kadin-gold/50 transition-all duration-300 transform hover:-translate-y-0.5 group shadow-lg"
            onClick={() => setCurrentPage("News")}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">
                Berita Terkini KADIN
              </h3>
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage("News");
                }}
                className="text-xs text-kadin-gold hover:underline cursor-pointer font-bold"
              >
                Lihat Semua
              </a>
            </div>
            <div className="space-y-4">
              {!loading &&
                news.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-4 group/item cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPage("News");
                    }}
                  >
                    <div className="flex-shrink-0 pt-1">
                      <div className="bg-kadin-navy p-2 rounded-md border border-gray-700 group-hover/item:border-kadin-gold/30 transition-colors">
                        <NewsIcon className="h-4 w-4 text-kadin-gold" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-kadin-white group-hover/item:text-kadin-gold text-xs leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-kadin-slate mt-1">
                        {item.category} •{" "}
                        {new Date(item.published_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Forum Discussions */}
          <div
            className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700 cursor-pointer hover:border-kadin-gold/50 transition-all duration-300 transform hover:-translate-y-0.5 group shadow-lg"
            onClick={() => setCurrentPage("KADINers Rooms")}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">
                Diskusi Forum Terkini
              </h3>
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage("KADINers Rooms");
                }}
                className="text-xs text-kadin-gold hover:underline cursor-pointer font-bold"
              >
                Masuk ke Forum
              </a>
            </div>
            <div className="space-y-3">
              {mockThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="p-4 rounded-lg bg-kadin-navy/40 hover:bg-kadin-navy group/item cursor-pointer border border-transparent hover:border-gray-600 transition-all shadow-inner"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPage("KADINers Rooms");
                  }}
                >
                  <h4 className="font-semibold text-kadin-white group-hover/item:text-kadin-gold text-xs">
                    {thread.title}
                  </h4>
                  <p className="text-[10px] text-kadin-slate mt-1">
                    Posted in{" "}
                    <span className="font-semibold text-kadin-light-slate">
                      {thread.category}
                    </span>{" "}
                    by {thread.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beranda;
