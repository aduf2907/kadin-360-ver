import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

// This is a mock implementation. In a real application, you would make an API call.
// The use of GoogleGenAI here is for demonstration purposes.
// We are returning a static list of users.

// FIX: Added bonafidityStatus and rating to mock users to match UserProfile type.
const mockUsers: UserProfile[] = [
  {
    id: 1,
    name: "Citra Lestari",
    company: "Agro Makmur Sejahtera",
    role: "CEO",
    avatar: "https://picsum.photos/id/1011/200/200",
    industry: "Agriculture",
    region: "Surabaya",
    interests: ["export", "sustainability"],
    isAiRecommended: true,
    level: "Premium",
    membershipId: "KDN-87654321",
    validThru: "11/26",
    bonafidityStatus: "Green",
    rating: 95,
    reviews: [
      {
        id: 1,
        reviewerId: 100,
        reviewerName: "Budi Santoso",
        reviewerAvatar: "https://picsum.photos/100",
        rating: 5,
        comment:
          "Citra is an expert in her field. Her insights on sustainable agriculture were invaluable to our project.",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        reviewerId: 3,
        reviewerName: "Rina Hartono",
        reviewerAvatar: "https://picsum.photos/id/1012/40/40",
        rating: 4,
        comment:
          "A pleasure to work with. Very professional and knowledgeable about the export market.",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 2,
    name: "Andi Wijaya",
    company: "PT. Maju Logistik",
    role: "Operations Manager",
    avatar: "https://picsum.photos/id/1027/200/200",
    industry: "Technology",
    region: "Jakarta",
    interests: ["supply chain", "iot"],
    isAiRecommended: true,
    level: "Verified",
    membershipId: "KDN-87654322",
    validThru: "10/25",
    bonafidityStatus: "Green",
    rating: 88,
    reviews: [],
  },
  {
    id: 3,
    name: "Rina Hartono",
    company: "Karya Manufaktur",
    role: "Director",
    avatar: "https://picsum.photos/id/1012/200/200",
    industry: "Manufacturing",
    region: "Bandung",
    interests: ["automation", "quality control"],
    isAiRecommended: false,
    level: "Active",
    membershipId: "KDN-87654323",
    validThru: "09/26",
    bonafidityStatus: "Yellow",
    rating: 72,
    reviews: [],
  },
  {
    id: 4,
    name: "David Lee",
    company: "Innovate Solutions",
    role: "CTO",
    avatar: "https://picsum.photos/id/1013/200/200",
    industry: "Technology",
    region: "International",
    interests: ["saas", "ai"],
    isAiRecommended: true,
    level: "Premium",
    membershipId: "KDN-87654324",
    validThru: "08/25",
    bonafidityStatus: "Green",
    rating: 98,
    reviews: [],
  },
  {
    id: 5,
    name: "Siti Aminah",
    company: "Green Energy Corp",
    role: "Founder",
    avatar: "https://picsum.photos/id/1014/200/200",
    industry: "Energy",
    region: "Jakarta",
    interests: ["renewable energy", "investment"],
    isAiRecommended: false,
    level: "Verified",
    membershipId: "KDN-87654325",
    validThru: "07/26",
    bonafidityStatus: "Green",
    rating: 90,
    reviews: [],
  },
  {
    id: 6,
    name: "Bambang Susilo",
    company: "Nusantara Foods",
    role: "Marketing Head",
    avatar: "https://picsum.photos/id/1015/200/200",
    industry: "F&B",
    region: "Surabaya",
    interests: ["branding", "digital marketing"],
    isAiRecommended: false,
    level: "Active",
    membershipId: "KDN-87654326",
    validThru: "06/25",
    bonafidityStatus: "Yellow",
    rating: 68,
    reviews: [],
  },
];

const currentUser = {
  name: "Budi Santoso",
  profile: "Premium Member, Technology, Jakarta",
  interests: ["AI", "Fintech", "SaaS"],
};

export const getAiRecommendations = async (
  allUsers: UserProfile[],
  currentUser: UserProfile,
): Promise<UserProfile[]> => {
  try {
    if (!allUsers || allUsers.length === 0) return [];

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Filter out the current user from matching
    const potentialPartners = allUsers.filter((u) => u.id !== currentUser.id);

    // Sending a more concise payload to the model
    const partnerProfiles = potentialPartners.map(
      ({ id, industry, region, interests, level }) => ({
        id,
        industry,
        region,
        interests,
        level,
      }),
    );

    const prompt = `
            The current user's profile is: Industry: ${currentUser.industry}, Region: ${currentUser.region}, Interests: ${currentUser.interests.join(", ")}.
            From the following list of potential partners, please recommend up to 4 that are the best match for business collaboration.
            Prioritize partners in the same industry, then with overlapping interests, and those with a 'Premium' or 'Verified' status.
            List of partners: ${JSON.stringify(partnerProfiles)}
            
            Return a JSON array containing only the 'id' of each recommended user.
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING }, // Supabase IDs are usually strings (UUID)
            },
            required: ["id"],
          },
        },
      },
    });

    const recommendedIdsData = JSON.parse(response.text || "[]") as {
      id: string | number;
    }[];
    const recommendedIds = new Set<string | number>(
      recommendedIdsData.map((u) => u.id.toString()),
    );

    return potentialPartners.map((user) => ({
      ...user,
      isAiRecommended: recommendedIds.has(user.id.toString()),
    }));
  } catch (error) {
    console.error("Failed to get AI recommendations:", error);
    return allUsers.map((user) => ({
      ...user,
      isAiRecommended: false,
    }));
  }
};

export const generateKnowledgeArticle = async (
  topic: string,
  targetAudience: string,
): Promise<{ title: string; category: string; summary: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
            You are a business and technology analyst for KADIN Indonesia.
            Your task is to write a concise and informative article summary (around 100-150 words) based on the provided topic.
            The summary must be specifically tailored for the target audience: "${targetAudience}".

            Audience Guidelines:
            - If the audience is "SMEs" (Small and Medium-sized Enterprises), focus on practical applications, cost-effectiveness, and competitive advantages. Use accessible language.
            - If the audience is "Executives", focus on strategic implications, ROI, market trends, and high-level business impact. Use professional, formal language.
            - If the audience is "General Public", explain concepts simply, avoid jargon, and highlight the broader economic or societal relevance.

            The overall tone should be professional and insightful.

            Topic: "${topic}"
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A compelling title for the article.",
            },
            category: {
              type: Type.STRING,
              description:
                "A relevant business category (e.g., Technology, Market Insight, Regulation, AI Generated).",
            },
            summary: {
              type: Type.STRING,
              description:
                "The generated article summary, around 100-150 words.",
            },
          },
          required: ["title", "category", "summary"],
        },
      },
    });

    const articleData = JSON.parse(response.text || "{}");
    // Ensure the category reflects its origin
    articleData.category = "AI Generated";
    return articleData;
  } catch (error) {
    console.error("Failed to generate knowledge article:", error);
    throw new Error(
      "Could not generate article. The AI service may be temporarily unavailable.",
    );
  }
};

export const generateStoryDraft = async (
  topic: string,
  audience: string,
): Promise<{ title: string; summary: string; tags: string[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
            You are an expert storyteller and business writer for KADIN Indonesia.
            Your task is to generate a draft for a "My Story" post based on a given topic, tailored for a specific audience.
            The story should be inspiring, insightful, and reflect an entrepreneurial journey.

            Topic: "${topic}"
            Audience: "${audience}"

            Guidelines:
            - Create a compelling and concise Title.
            - Write a Summary of about 150-200 words. It should be a well-written narrative that captures the essence of the topic.
            - Generate an array of 3-5 relevant Tags (e.g., "Startup Journey", "Innovation", "Leadership").

            The response must be in a JSON format.
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["title", "summary", "tags"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to generate story draft:", error);
    throw new Error(
      "Could not generate story draft. The AI service may be temporarily unavailable.",
    );
  }
};

export const generateDashboardInsights = async (
  userProfile: UserProfile,
): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
            Based on the user profile of ${userProfile.name}, a ${userProfile.role} at ${userProfile.company} in the ${userProfile.industry} industry with interests in ${userProfile.interests.join(", ")}, generate 3 short, actionable insights to help them maximize their experience on the KADIN 360 platform.

            Frame the insights as direct suggestions. For example: "Explore...", "Connect with...", "Check out...".
            The insights should be relevant to the platform's features (Business Matching, Knowledge Hub, Communities, Events). Keep each insight to a single sentence.
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of 3 short, actionable insight strings.",
            },
          },
          required: ["insights"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return Array.isArray(data.insights) ? data.insights : [];
  } catch (error) {
    console.error("Failed to generate dashboard insights:", error);
    // Fallback to generic insights
    return [
      "Explore the Member Directory to find new connections in your industry.",
      "Check the Knowledge Hub for the latest articles and whitepapers.",
      "Join a Community Group to engage in focused discussions.",
    ];
  }
};
