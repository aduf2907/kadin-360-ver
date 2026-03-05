// FIX: Removed self-import of 'Page' which was causing a name conflict.
export type Page =
  | "Beranda"
  | "Login"
  | "Dashboard"
  | "Communication"
  | "Knowledge"
  | "News"
  | "Matching"
  | "Insight"
  | "Profile"
  | "Edit Profile"
  | "Experience"
  | "Community"
  | "My Story"
  | "Franchise"
  | "Franchise Management"
  | "Secretariat"
  | "HalloHukum"
  | "Business Advisor"
  | "KADINers Rooms"
  | "Mitra KADIN"
  | "Membership Card"
  | "Member Directory"
  | "Gabung Sekarang"
  | "Upgrade"
  | "Project Opportunities"
  | "Project Details"
  | "Document Hub"
  | "Bonafiditas"
  | "Event Management"
  | "Activities Management"
  | "Event Details"
  | "Events"
  | "Project Management"
  | "Partner Management"
  | "Knowledge Management"
  | "Experience Management"
  | "Story Management"
  | "Community Management";

export interface NewsArticle {
  id: number;
  title: string;
  category: string;
  summary: string;
  excerpt?: string;
  image_url?: string;
  author?: string;
  published_at?: string;
  date: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: number;
  sender: "user" | "contact";
  text: string;
  timestamp: string;
}

export interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  priority?: "High" | "Medium" | "Low";
}

export interface KnowledgeEntry {
  id: string;
  created_at: string;
  title: string;
  category: string;
  content: string;
  image_url: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  status: "pending" | "approved" | "rejected";
}

export interface UserReview {
  id: number;
  reviewerId: number;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number; // 1 to 5
  comment: string;
  date: string; // ISO 8601 format
}

export interface ExperienceEntry {
  id: string;
  created_at: string;
  title: string;
  category: string;
  content: string;
  image_url: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  status: "pending" | "approved" | "rejected";
}

export interface StoryEntry {
  id: string;
  created_at: string;
  title: string;
  category: string;
  content: string;
  image_url: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  status: "pending" | "approved" | "rejected";
}

export interface UserProfile {
  id: number;
  name: string;
  company: string;
  role: string;
  is_admin?: boolean;
  avatar_url?: string;
  avatar?: string;
  industry: string;
  region: string;
  interests: string[];
  isAiRecommended: boolean;
  level: "Premium" | "Verified" | "Active" | "New";
  membershipId: string;
  membership_type: string;
  validThru: string;
  bio?: string;
  bonafidityStatus: "Green" | "Yellow" | "Red" | "Black";
  rating: number;
  reviews?: UserReview[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
}

export interface DiscussionThread {
  id: number;
  title: string;
  category: string;
  author: string;
  authorAvatar: string;
  replies: number;
  lastActivity: string;
}

export interface ExperiencePost {
  id: number;
  title: string;
  category: string;
  author: string;
  authorAvatar: string;
  imageUrl: string;
  summary: string;
  date: string;
}

export interface CommunityGroup {
  id: string;
  created_at: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  member_count: number;
  is_approved: boolean;
  created_by: string;
}

export interface CommunityEvent {
  id: number;
  title: string;
  group: string;
  date: string;
  location: string;
  imageUrl: string;
}

export interface MyStoryPost {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  imageUrl: string;
  summary: string;
  tags: string[];
  date: string;
}

export interface FranchiseOpportunity {
  id: number | string;
  name: string;
  category: string;
  investment: string;
  imageUrl: string;
  description: string;
  location?: string;
  established?: string;
  outlets?: string;
  contact?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface KadinPartner {
  id: number;
  name: string;
  category: string;
  logoUrl: string;
  description: string; // Short description for the card
  offer: string;
  about: string; // Detailed description for the modal
  services: string[];
  targetIndustries: string[];
  contact: {
    email: string;
    phone: string;
    website: string;
  };
}

export interface ActivityEvent {
  type: "page_view" | "action" | "chatbot_interaction";
  payload: string; // e.g., 'Dashboard' page, 'user_logout' action, 'chatbot_opened'
  timestamp: string; // ISO 8601 format
}

export interface ProjectOpportunity {
  id: number;
  title: string;
  source:
    | "Government"
    | "World Bank"
    | "Private Sector"
    | "KADIN Initiative"
    | "Asian Development Bank";
  sectors: string[];
  description: string;
  value: string; // e.g., 'IDR 50 Billion', '$1.2 Million'
  status: "Open for Bidding" | "In Progress" | "Closed";
  deadline: string; // e.g., 'Dec 31, 2024'
  requirements: string[];
  eligibility: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface Document {
  id: number;
  name: string;
  category: "Circular" | "Official Letter" | "Report" | "Guideline";
  uploadedDate: string;
  fileSize: string; // e.g., '2.5 MB'
}

export interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  description: string;
}

export interface Speaker {
  id: number;
  name: string;
  title: string;
  avatar: string;
  bio: string;
}

export interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
}

export interface KadinEvent {
  id: number;
  title?: string;
  name: string;
  date: string;
  location: string;
  type: "Webinar" | "Conference" | "Workshop" | "Mixer";
  status: "Published" | "Draft" | "Completed";
  registrants: number;
  capacity: number;
  description: string;
  agenda: AgendaItem[];
  speakers: Speaker[];
  sponsors: Sponsor[];
}

export interface KadinActivity {
  id: number;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Completed";
}

export interface DiscussionEntry {
  id: string;
  created_at: string;
  title: string;
  category: string;
  content: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  replies_count?: number;
}

export interface ReplyEntry {
  id: string;
  created_at: string;
  discussion_id: string;
  content: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
}

export interface AddGroupInput {
  name: string;
  description: string;
  category: string;
  created_by: string;
}
