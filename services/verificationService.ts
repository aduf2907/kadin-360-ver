import { GoogleGenAI, Type } from "@google/genai";

// This is a mock service. In a real app, this would involve backend calls.
// The use of GoogleGenAI here is for demonstration purposes.

/**
 * Simulates a document verification process using a generative model.
 * In a real-world scenario, you might use AI to extract information from documents,
 * but the final verification would involve secure backend checks.
 */
export const requestVerification = async (documentType: string, userName: string): Promise<{ status: 'success' | 'failed'; message: string }> => {
    console.log(`Starting verification for ${userName} with document type: ${documentType}`);

    // Simulate calling Gemini API
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Simulate a verification check for user "${userName}" submitting a "${documentType}". Based on these inputs, decide if the verification is successful. Return a short JSON object with "status": "success" or "failed", and a "message".`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.STRING },
                        message: { type: Type.STRING },
                    },
                    required: ["status", "message"],
                }
            }
        });

        console.log("Gemini API call simulated for verification.");
        
        const result = JSON.parse(response.text) as { status: 'success' | 'failed'; message: string };
        
        // Handle different AI response scenarios
        return new Promise(resolve => {
            setTimeout(() => {
                 console.log("Verification process complete with AI response.");
                 if (result.status === 'failed') {
                    // Override with a specific error message for failure cases
                    resolve({ status: 'failed', message: 'Verification failed. The submitted document could not be validated by our system.' });
                 } else {
                    // Proceed as normal for success cases
                    resolve(result);
                 }
            }, 1500); // Keep a small delay to simulate processing
        });


    } catch (error) {
        console.error("Error during AI verification simulation:", error);
        // Fallback to a failed state if API simulation fails
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ status: 'failed', message: 'AI service is currently unavailable. Please try again later.' });
            }, 1000);
        });
    }
};