import React, { useState, useEffect } from "react";
import { Page, UserProfile } from "../types";
import DashboardIcon from "./icons/DashboardIcon";
import CommunicationIcon from "./icons/CommunicationIcon";
import KnowledgeIcon from "./icons/KnowledgeIcon";
import MatchingIcon from "./icons/MatchingIcon";
import InsightIcon from "./icons/InsightIcon";
import ProfileIcon from "./icons/ProfileIcon";
import HomeIcon from "./icons/HomeIcon";
import ExperienceIcon from "./icons/ExperienceIcon";
import CommunityIcon from "./icons/CommunityIcon";
import MyStoryIcon from "./icons/MyStoryIcon";
import FranchiseIcon from "./icons/FranchiseIcon";
import SecretariatIcon from "./icons/SecretariatIcon";
import KADINersRoomsIcon from "./icons/KADINersRoomsIcon";
import MitraIcon from "./icons/MitraIcon";
import DirectoryIcon from "./icons/DirectoryIcon";
import HalloHukumIcon from "./icons/HalloHukumIcon";
import BusinessAdvisorIcon from "./icons/BusinessAdvisorIcon";
import UserPlusIcon from "./icons/UserPlusIcon";
import UpgradeIcon from "./icons/UpgradeIcon";
import ProjectOpportunitiesIcon from "./icons/ProjectOpportunitiesIcon";
import BonafiditasIcon from "./icons/BonafiditasIcon";
import EventManagementIcon from "./icons/EventManagementIcon";
import ActivitiesManagementIcon from "./icons/ActivitiesManagementIcon";

interface SidebarProps {
  isOpen: boolean;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  toggleSidebar: () => void;
  user: UserProfile;
}

export interface NavItem {
  page: Page;
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  adminOnly?: boolean;
}

export interface NavCategory {
  title: string;
  color: string;
  items: NavItem[];
  adminOnly?: boolean;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export const navCategories: NavCategory[] = [
  {
    title: "Home",
    color: "text-blue-400",
    items: [
      {
        page: "Beranda",
        icon: <HomeIcon className="h-6 w-6" />,
        label: "Home",
      },
      // {
      //   page: "Gabung Sekarang",
      //   icon: <UserPlusIcon className="h-6 w-6" />,
      //   label: "Join Now",
      // },
      {
        page: "Dashboard",
        icon: <DashboardIcon className="h-6 w-6" />,
        label: "Dashboard",
      },
      {
        page: "Profile",
        icon: <ProfileIcon className="h-6 w-6" />,
        label: "Profile",
      },
    ],
  },
  {
    title: "Collaboration",
    color: "text-purple-400",
    items: [
      {
        page: "Communication",
        icon: <CommunicationIcon className="h-6 w-6" />,
        label: "Communication",
      },
      {
        page: "KADINers Rooms",
        icon: <KADINersRoomsIcon className="h-6 w-6" />,
        label: "KADINers Rooms",
      },
      {
        page: "Community",
        icon: <CommunityIcon className="h-6 w-6" />,
        label: "Community",
      },
      {
        page: "Events",
        icon: <EventManagementIcon className="h-6 w-6" />,
        label: "Agenda & Event",
      },
      {
        page: "Member Directory",
        icon: <DirectoryIcon className="h-6 w-6" />,
        label: "Member Directory",
      },
    ],
  },
  {
    title: "Opportunities",
    color: "text-green-400",
    items: [
      {
        page: "Matching",
        icon: <MatchingIcon className="h-6 w-6" />,
        label: "Business Matching",
      },
      {
        page: "Project Opportunities",
        icon: <ProjectOpportunitiesIcon className="h-6 w-6" />,
        label: "Project Opportunities",
      },
      {
        page: "Franchise",
        icon: <FranchiseIcon className="h-6 w-6" />,
        label: "Franchise",
      },
      {
        page: "Mitra KADIN",
        icon: <MitraIcon className="h-6 w-6" />,
        label: "KADIN Partners",
      },
    ],
  },
  {
    title: "Insights",
    color: "text-yellow-400",
    items: [
      {
        page: "Knowledge",
        icon: <KnowledgeIcon className="h-6 w-6" />,
        label: "Knowledge & Learning",
      },
      {
        page: "Experience",
        icon: <ExperienceIcon className="h-6 w-6" />,
        label: "Experience",
      },
      {
        page: "My Story",
        icon: <MyStoryIcon className="h-6 w-6" />,
        label: "My Story",
      },
      {
        page: "Insight",
        icon: <InsightIcon className="h-6 w-6" />,
        label: "Insights",
      },
    ],
  },
  {
    title: "Administration",
    color: "text-red-400",
    items: [
      {
        page: "Secretariat",
        icon: <SecretariatIcon className="h-6 w-6" />,
        label: "Secretariat",
      },
      {
        page: "HalloHukum",
        icon: <HalloHukumIcon className="h-6 w-6" />,
        label: "HalloHukum",
      },
      {
        page: "Business Advisor",
        icon: <BusinessAdvisorIcon className="h-6 w-6" />,
        label: "Business Advisor",
      },
      {
        page: "Bonafiditas",
        icon: <BonafiditasIcon className="h-6 w-6" />,
        label: "User Bonafidity",
      },
      {
        page: "Upgrade",
        icon: <UpgradeIcon className="h-6 w-6" />,
        label: "Upgrade to Premium",
      },
    ],
  },
  {
    title: "Admin: Platform",
    color: "text-orange-400",
    adminOnly: true,
    items: [
      {
        page: "Activities Management",
        icon: <ActivitiesManagementIcon className="h-6 w-6" />,
        label: "Activities",
        adminOnly: true,
      },
      {
        page: "Community Management",
        icon: <CommunityIcon className="h-6 w-6" />,
        label: "Community",
        adminOnly: true,
      },
      {
        page: "Knowledge Management",
        icon: <KnowledgeIcon className="h-6 w-6" />,
        label: "Knowledge",
        adminOnly: true,
      },
      {
        page: "Experience Management",
        icon: <ExperienceIcon className="h-6 w-6" />,
        label: "Experience",
        adminOnly: true,
      },
      {
        page: "Story Management",
        icon: <MyStoryIcon className="h-6 w-6" />,
        label: "Stories",
        adminOnly: true,
      },
      {
        page: "Insight Management",
        icon: <InsightIcon className="h-6 w-6" />,
        label: "Insight Management",
        adminOnly: true,
      },
    ],
  },
  {
    title: "Admin: Business",
    color: "text-yellow-400",
    adminOnly: true,
    items: [
      {
        page: "Project Management",
        icon: <ProjectOpportunitiesIcon className="h-6 w-6" />,
        label: "Projects",
        adminOnly: true,
      },
      {
        page: "Franchise Management",
        icon: <FranchiseIcon className="h-6 w-6" />,
        label: "Franchise",
        adminOnly: true,
      },
      {
        page: "Partner Management",
        icon: <MitraIcon className="h-6 w-6" />,
        label: "Partners",
        adminOnly: true,
      },
      {
        page: "Legal Management",
        icon: <HalloHukumIcon className="h-6 w-6" />,
        label: "Legal",
        adminOnly: true,
      },
      {
        page: "Business Management",
        icon: <BusinessAdvisorIcon className="h-6 w-6" />,
        label: "Business",
        adminOnly: true,
      },
      {
        page: "Bonafidity Management",
        icon: <BonafiditasIcon className="h-6 w-6" />,
        label: "Bonafidity",
        adminOnly: true,
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentPage,
  setCurrentPage,
  toggleSidebar,
  user,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const activeCategory = navCategories.find((cat) =>
      cat.items.some((item) => item.page === currentPage),
    );
    if (activeCategory) {
      setExpandedCategory(activeCategory.title);
    }
  }, [currentPage]);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  const toggleCategory = (title: string) => {
    setExpandedCategory((prev) => (prev === title ? null : title));
  };

  const isDashboard = currentPage === "Dashboard";

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed lg:sticky lg:top-0 h-screen lg:h-[calc(100vh-footerHeight)] flex flex-col bg-kadin-light-navy text-kadin-light-slate z-30 transform transition-all duration-300 ease-in-out group ${isDashboard ? "lg:w-64" : "lg:w-20 lg:hover:w-64"} ${isOpen ? "translate-x-0 w-64" : "-translate-x-full"} lg:translate-x-0 border-r border-gray-700`}
      >
        <div className="flex items-center justify-center h-20 border-b border-gray-700 flex-shrink-0 px-4">
          <div className="w-full">
            <div
              className={`text-center ${isDashboard ? "lg:hidden" : "lg:group-hover:hidden"}`}
            >
              <span className="font-bold text-3xl text-kadin-gold">K</span>
            </div>
            <h1
              className={`text-xl font-semibold text-kadin-white hidden items-center justify-between ${isDashboard ? "lg:flex" : "lg:group-hover:flex"}`}
            >
              <span>
                KADIN <span className="text-kadin-gold">360</span>
              </span>
            </h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-kadin-slate absolute right-4 top-6"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {isDashboard && (
          <div className="px-4 py-5 border-b border-gray-700">
            <div
              className="flex items-center space-x-3 cursor-pointer group/profile justify-center lg:justify-start"
              onClick={() => setCurrentPage("Profile")}
            >
              <img
                src={user.avatar_url}
                alt={user.name}
                className="h-12 w-12 rounded-full border-2 border-kadin-gold/50 flex-shrink-0"
              />
              <div
                className={`min-w-0 hidden ${isDashboard ? "lg:block" : "lg:group-hover:block"}`}
              >
                <h4 className="font-bold text-kadin-white group-hover/profile:text-kadin-gold transition-colors truncate">
                  {user.name}
                </h4>
                <p className="text-xs text-kadin-slate truncate">
                  {user.company}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul>
            {navCategories.map((category, index) => {
              if (category.adminOnly && (!user || user.is_admin !== true))
                return null;

              // Pengecekan ketat: Hanya tampilkan jika item tidak khusus admin,
              // atau jika user secara eksplisit memiliki is_admin === true
              const filteredItems = category.items.filter((item) => {
                if (item.adminOnly) {
                  return user && user.is_admin === true;
                }
                return true;
              });

              if (filteredItems.length === 0) return null;

              const isExpanded = expandedCategory === category.title;
              const hasActiveItem = filteredItems.some(
                (i) => i.page === currentPage,
              );

              return (
                <li key={category.title} className="mb-1">
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className={`w-full flex items-center px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 
                                            ${isExpanded || hasActiveItem ? "text-kadin-gold bg-kadin-navy/30" : "text-kadin-slate hover:text-kadin-white hover:bg-kadin-navy/20"}
                                            justify-between group/cat`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center ${isDashboard ? "lg:hidden" : "lg:group-hover:hidden"}`}
                      >
                        {React.cloneElement(filteredItems[0].icon, {
                          className: `h-5 w-5 ${category.color}`,
                        })}
                      </div>
                      <span
                        className={`ml-0 hidden ${isDashboard ? "lg:inline" : "lg:group-hover:inline"}`}
                      >
                        {category.title}
                      </span>
                    </div>

                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-300 hidden ${isDashboard ? "lg:block" : "lg:group-hover:block"} 
                                            ${isExpanded ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>

                  <ul
                    className={`overflow-hidden transition-all duration-300 ease-in-out bg-kadin-navy/10 
                                        ${isExpanded ? "max-h-[500px] opacity-100 py-2" : "max-h-0 opacity-0"}`}
                  >
                    {filteredItems.map((item) => {
                      const isActive = currentPage === item.page;
                      return (
                        <li
                          key={item.page}
                          className="px-4 relative group/item"
                        >
                          <a
                            onClick={() => handleNavigation(item.page)}
                            className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 
                                                            ${isDashboard ? "lg:justify-start" : "lg:group-hover:justify-start"} justify-center
                                                            ${
                                                              isActive
                                                                ? "bg-kadin-gold/20 text-kadin-gold border-r-4 border-kadin-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                                                                : "hover:bg-kadin-navy hover:text-kadin-white"
                                                            }`}
                          >
                            <span
                              className={`transition-colors duration-200 ${isActive ? "text-kadin-gold" : `${category.color} group-hover/item:text-white`}`}
                            >
                              {React.cloneElement(item.icon, {
                                className: "h-5 w-5 flex-shrink-0",
                              })}
                            </span>
                            <span
                              className={`ml-4 text-sm hidden whitespace-nowrap ${isDashboard ? "lg:inline" : "lg:group-hover:inline"} ${isActive ? "font-bold" : ""}`}
                            >
                              {item.label}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700 mt-auto">
          <div className="bg-kadin-navy p-4 rounded-lg text-center">
            <div
              className={`hidden ${isDashboard ? "lg:block" : "lg:group-hover:block"}`}
            >
              <h4 className="font-bold text-kadin-white text-sm">
                Premium Access
              </h4>
            </div>
            <button
              onClick={() => setCurrentPage("Upgrade")}
              className="w-full bg-kadin-gold text-kadin-navy font-bold py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors flex items-center justify-center"
            >
              <span
                className={`hidden ${isDashboard ? "lg:inline" : "lg:group-hover:inline"}`}
              >
                Upgrade
              </span>
              <UpgradeIcon
                className={`h-5 w-5 ${isDashboard ? "hidden" : "lg:hidden lg:group-hover:hidden"}`}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
