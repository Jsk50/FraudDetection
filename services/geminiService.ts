
import { GoogleGenAI, Type } from "@google/genai";
import type { Transaction } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const transactionSchema = {
    type: Type.OBJECT,
    properties: {
        suspiciousFound: {
            type: Type.BOOLEAN,
            description: "A boolean indicating if any suspicious transactions were identified or generated."
        },
        transactions: {
            type: Type.ARRAY,
            description: "A list of mock transactions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { 
                        type: Type.STRING, 
                        description: "Unique transaction ID, e.g., 'TXN' followed by 8 random digits."
                    },
                    amount: { 
                        type: Type.NUMBER,
                        description: "The monetary value of the transaction."
                    },
                    fraudScore: { 
                        type: Type.INTEGER,
                        description: "A score from 0-100 indicating the likelihood of fraud."
                    },
                    timestamp: { 
                        type: Type.STRING,
                        description: "An ISO 8601 formatted timestamp for the transaction."
                    },
                    isSuspicious: { 
                        type: Type.BOOLEAN,
                        description: "A flag that is true if the transaction is considered suspicious (e.g., fraud score > 75)."
                    }
                },
                required: ["id", "amount", "fraudScore", "timestamp", "isSuspicious"]
            },
        },
    },
    required: ["suspiciousFound", "transactions"]
};

export const fetchTransactionAnalysis = async (query: string): Promise<{ transactions: Transaction[], suspiciousFound: boolean }> => {
    const prompt = `
        You are a fraud detection API for a digital payments system. 
        Based on the user's query, generate a realistic list of 5 to 10 mock transactions.
        The user query is: "${query}".

        For each transaction, provide a unique transaction ID (e.g., "TXN" followed by 8 random digits), an amount, a fraud score (0-100), and a recent timestamp in ISO 8601 format.

        - If the query is a specific transaction ID, generate only that transaction with plausible details.
        - If the query specifies an amount (e.g., 'amount > 50000', 'amount = 123.45'), generate transactions that match this criteria.
        - For any transaction you generate with a fraud score over 75, you MUST set its 'isSuspicious' flag to true. For all others, set it to false.
        - If the query itself implies searching for suspicious activity (e.g., "high-value transactions", "suspicious activity"), ensure at least one generated transaction is suspicious.
        
        Finally, determine if any suspicious activity was found overall (i.e., if any transaction has 'isSuspicious' set to true) and set the top-level 'suspiciousFound' flag accordingly. Return the data in the specified JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: transactionSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedData = JSON.parse(jsonString);

        if (parsedData && Array.isArray(parsedData.transactions)) {
            return {
                transactions: parsedData.transactions as Transaction[],
                suspiciousFound: parsedData.suspiciousFound || false,
            };
        } else {
            console.error("Parsed data is not in the expected format:", parsedData);
            return { transactions: [], suspiciousFound: false };
        }

    } catch (error) {
        console.error("Error fetching transaction analysis:", error);
        throw new Error("Failed to get a valid response from the AI model.");
    }
};
