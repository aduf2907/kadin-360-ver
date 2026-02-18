import React, { useState, useEffect } from "react";
import {
  Page,
  UserProfile,
  ActivityEvent,
  KadinEvent,
  ProjectOpportunity,
} from "./types";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import Communication from "./components/Communication";
import Knowledge from "./components/Knowledge";
import Matching from "./components/Matching";
import Insight from "./components/Insight";
import Profile from "./components/Profile";
import Beranda from "./components/Beranda";
import Experience from "./components/Experience";
import Community from "./components/Community";
import MyStory from "./components/MyStory";
import Franchise from "./components/Franchise";
import Secretariat from "./components/Secretariat";
import KADINersRooms from "./components/KADINersRooms";
import Mitra from "./components/Mitra";
import MemberDirectory from "./components/MemberDirectory";
import MembershipCard from "./components/MembershipCard";
import HalloHukum from "./components/HalloHukum";
import BusinessAdvisor from "./components/BusinessAdvisor";
import GabungSekarangPage from "./components/GabungSekarangPage";
import LoginPage from "./components/LoginPage";
import AIChatbot from "./components/AIChatbot";
import PromoCarousel from "./components/PromoCarousel";
import Breadcrumb from "./components/Breadcrumb";
import EditProfile from "./components/EditProfile";
import UpgradePage from "./components/UpgradePage";
import ProjectOpportunities from "./components/ProjectOpportunities";
import DocumentHub from "./components/DocumentHub";
import Bonafiditas from "./components/Bonafiditas";
import EventManagement from "./components/EventManagement";
import ActivitiesManagement from "./components/ActivitiesManagement";
import EventDetails from "./components/EventDetails";
import ProjectDetail from "./components/ProjectDetail";
import supabase from "./src/supabase-client";

const ACTIVITY_LOG_KEY = "kadin360-user-activity";
const LAST_PAGE_KEY = "kadin360-last-visited-page";
const MAX_LOG_SIZE = 50;

const App: React.FC = () => {
  // Inisialisasi halaman dari localStorage jika tersedia, jika tidak default ke Beranda
  const [currentPage, _setCurrentPage] = useState<Page>(() => {
    const saved = localStorage.getItem(LAST_PAGE_KEY);
    return (saved as Page) || "Beranda";
  });

  //   const [currentPage, _setCurrentPage] = useState<Page>("Beranda");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [viewedUser, setViewedUser] = useState<UserProfile | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<KadinEvent | null>(null);
  const [selectedProject, setSelectedProject] =
    useState<ProjectOpportunity | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Mock user profile data
  const [user, setUser] = useState<UserProfile>({
    id: 100,
    name: "Budi Santoso",
    company: "PT. Digital Maju Bersama",
    role: "Founder & CEO",
    avatar: "https://picsum.photos/100",
    industry: "Technology",
    region: "Jakarta",
    interests: ["AI", "Fintech", "SaaS", "E-commerce"],
    isAiRecommended: false,
    level: "Active",
    membershipId: "KDN-12345678",
    validThru: "12/25",
    bio: "Visionary entrepreneur with over 15 years of experience in the technology sector. Passionate about leveraging AI and digital solutions to solve real-world problems. Actively seeking collaboration in fintech and sustainable tech.",
    bonafidityStatus: "Green",
    rating: 92,
    reviews: [
      {
        id: 1,
        reviewerId: 2,
        reviewerName: "Andi Wijaya",
        reviewerAvatar: "https://picsum.photos/id/1027/40/40",
        rating: 5,
        comment:
          "Budi is a true visionary. Our collaboration on the logistics platform was seamless and highly productive. Highly recommended.",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  });

  useEffect(() => {
    const initAuth = async () => {
      setIsAuthChecking(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Jika sudah login, izinkan akses ke halaman privat yang tersimpan
        const publicPages: Page[] = ["Beranda", "Login", "Gabung Sekarang"];
        if (publicPages.includes(currentPage)) {
          setCurrentPage("Dashboard");
        }
        if (session.user.email) {
          setUser((prev) => ({
            ...prev,
            name: session.user.email?.split("@")[0] || prev.name,
          }));
        }
      } else {
        // Jika tidak login, paksa ke Beranda (kecuali sedang di halaman registrasi)
        if (currentPage !== "Gabung Sekarang" && currentPage !== "Login") {
          setCurrentPage("Beranda");
        }
      }
      setIsAuthChecking(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        if (
          currentPage === "Beranda" ||
          currentPage === "Login" ||
          currentPage === "Gabung Sekarang"
        ) {
          setCurrentPage("Dashboard");
        }
      } else {
        setCurrentPage("Beranda");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logUserActivity = (type: ActivityEvent["type"], payload: string) => {
    try {
      const newEvent: ActivityEvent = {
        type,
        payload,
        timestamp: new Date().toISOString(),
      };

      const existingLog = localStorage.getItem(ACTIVITY_LOG_KEY);
      let currentLog: ActivityEvent[] = existingLog
        ? JSON.parse(existingLog)
        : [];

      // Add the new event to the beginning of the array
      currentLog.unshift(newEvent);

      // Cap the log size to prevent it from growing indefinitely
      if (currentLog.length > MAX_LOG_SIZE) {
        currentLog = currentLog.slice(0, MAX_LOG_SIZE);
      }

      localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(currentLog));
    } catch (error) {
      console.error("Failed to log user activity:", error);
    }
  };

  const setCurrentPage = (page: Page, payload?: any) => {
    _setCurrentPage(page);
    logUserActivity("page_view", page);

    if (page === "Profile" && payload?.id && payload.id !== user.id) {
      setViewedUser(payload as UserProfile);
    } else {
      setViewedUser(null);
    }

    if (page === "Event Details" && payload) {
      setSelectedEvent(payload as KadinEvent);
    } else if (page !== "Event Details") {
      // Clear event when navigating away
      setSelectedEvent(null);
    }

    if (page === "Project Details" && payload) {
      setSelectedProject(payload as ProjectOpportunity);
    } else if (page !== "Project Details") {
      // Clear project when navigating away
      setSelectedProject(null);
    }

    window.scrollTo(0, 0);

    if (window.innerWidth < 1024) {
      // lg breakpoint
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    // In a real app, you'd clear tokens, reset state management, etc.
    logUserActivity("action", "user_logout");
    // Redirect to Beranda which acts as the landing page
    setCurrentPage("Beranda");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "Beranda":
        return <Beranda setCurrentPage={setCurrentPage} />;
      case "Login":
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case "Dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} user={user} />;
      case "Communication":
        return <Communication />;
      case "Knowledge":
        return <Knowledge />;
      case "Matching":
        return <Matching />;
      case "Insight":
        return <Insight />;
      case "Profile":
        return (
          <Profile
            user={viewedUser || user}
            mainUser={user}
            setUser={setUser}
            setCurrentPage={setCurrentPage}
            isOwnProfile={!viewedUser || viewedUser.id === user.id}
          />
        );
      case "Edit Profile":
        return (
          <EditProfile
            user={user}
            setUser={setUser}
            setCurrentPage={setCurrentPage}
          />
        );
      case "Experience":
        return <Experience />;
      case "Community":
        return <Community />;
      case "My Story":
        return <MyStory />;
      case "Franchise":
        return <Franchise />;
      case "Secretariat":
        return <Secretariat setCurrentPage={setCurrentPage} />;
      case "HalloHukum":
        return <HalloHukum />;
      case "Business Advisor":
        return <BusinessAdvisor />;
      case "KADINers Rooms":
        return <KADINersRooms />;
      case "Mitra KADIN":
        return <Mitra />;
      case "Membership Card":
        return <MembershipCard user={user} />;
      case "Member Directory":
        return <MemberDirectory setCurrentPage={setCurrentPage} />;
      case "Gabung Sekarang":
        return <GabungSekarangPage setCurrentPage={setCurrentPage} />;
      case "Upgrade":
        return <UpgradePage setCurrentPage={setCurrentPage} />;
      case "Project Opportunities":
        return <ProjectOpportunities setCurrentPage={setCurrentPage} />;
      case "Document Hub":
        return <DocumentHub />;
      case "Bonafiditas":
        return <Bonafiditas user={user} />;
      case "Event Management":
        return <EventManagement setCurrentPage={setCurrentPage} />;
      case "Activities Management":
        return <ActivitiesManagement />;
      case "Event Details":
        return selectedEvent ? (
          <EventDetails event={selectedEvent} setCurrentPage={setCurrentPage} />
        ) : (
          <EventManagement setCurrentPage={setCurrentPage} />
        );
      case "Project Details":
        return selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <ProjectOpportunities setCurrentPage={setCurrentPage} />
        );
      default:
        return <Beranda setCurrentPage={setCurrentPage} />;
    }
  };

  // Pages that are displayed without the sidebar layout (Public/Landing Pages)
  const isPublicPage =
    currentPage === "Beranda" ||
    currentPage === "Gabung Sekarang" ||
    currentPage === "Login";

  if (isPublicPage) {
    return (
      <div className="bg-kadin-navy text-kadin-slate min-h-screen flex flex-col">
        {/* Optional: Add a simple Public Header here if needed in future */}
        <div className="flex-1">
          {currentPage === "Gabung Sekarang" ? (
            <GabungSekarangPage setCurrentPage={setCurrentPage} />
          ) : currentPage === "Login" ? (
            <LoginPage setCurrentPage={setCurrentPage} />
          ) : (
            <Beranda setCurrentPage={setCurrentPage} />
          )}
        </div>
        {/* Footer is only shown on Beranda, Gabung Sekarang has its own layout needs or can share footer */}
        {currentPage === "Beranda" && (
          <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />
        )}
      </div>
    );
  }

  // return (
  //     <div className="bg-kadin-navy text-kadin-slate min-h-screen flex">
  //         <Sidebar isOpen={isSidebarOpen} currentPage={currentPage} setCurrentPage={setCurrentPage} toggleSidebar={toggleSidebar} user={user} />
  //         <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
  //             <Header toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} handleLogout={handleLogout} />
  //             <main className="flex-1 p-4 md:p-8 overflow-y-auto">
  //                 <Breadcrumb currentPage={currentPage} setCurrentPage={setCurrentPage} />
  //                 {renderPage()}
  //             </main>
  //             <PromoCarousel setCurrentPage={setCurrentPage} />
  //             <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />
  //         </div>
  //         <AIChatbot userProfile={user} logUserActivity={logUserActivity} />
  //     </div>
  // );

  return (
    <div className="bg-kadin-navy text-kadin-slate min-h-screen flex flex-col overflow-x-hidden">
      {/* Bagian Utama: Sidebar di kiri, Konten di kanan */}
      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          toggleSidebar={toggleSidebar}
          user={user}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            toggleSidebar={toggleSidebar}
            setCurrentPage={setCurrentPage}
            handleLogout={handleLogout}
          />
          <main className="flex-1 p-4 md:p-8 w-full">
            <Breadcrumb
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <div className="w-full">{renderPage()}</div>
            <div className="mt-12">
              <PromoCarousel setCurrentPage={setCurrentPage} />
            </div>
          </main>
        </div>
      </div>

      {/* Footer di bagian paling bawah, membentang 100% lebar layar */}
      <div className="w-full border-t border-gray-700 bg-kadin-light-navy shadow-inner z-10">
        <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      <AIChatbot userProfile={user} logUserActivity={logUserActivity} />
    </div>
  );
};

export default App;
