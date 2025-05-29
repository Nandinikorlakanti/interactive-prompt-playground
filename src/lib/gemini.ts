import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the API key from environment variables
export const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the generative model
export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Constants for penalty ranges
const MIN_PENALTY = 0;
const MAX_PENALTY = 1.5;

// Type for generation parameters
interface GenerationParams {
  presencePenalty?: number;
  frequencyPenalty?: number;
}

// Custom error class for penalty validation
class PenaltyRangeError extends Error {
  constructor(param: string, value: number) {
    super(`${param} must be between ${MIN_PENALTY} and ${MAX_PENALTY}. Received: ${value}`);
    this.name = 'PenaltyRangeError';
  }
}

// Validate penalty values with strict range checking
function validatePenalty(value: number | undefined, paramName: string): number | undefined {
  if (value === undefined) return undefined;
  
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${paramName} must be a valid number`);
  }
  
  if (value < MIN_PENALTY || value > MAX_PENALTY) {
    throw new PenaltyRangeError(paramName, value);
  }
  
  return value;
}

// Helper function to generate text
export async function generateText(prompt: string, params: GenerationParams = {}) {
  try {
    // Validate penalties
    const presencePenalty = validatePenalty(params.presencePenalty, 'presencePenalty');
    const frequencyPenalty = validatePenalty(params.frequencyPenalty, 'frequencyPenalty');

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        presencePenalty,
        frequencyPenalty,
      },
    });
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    if (error instanceof PenaltyRangeError) {
      console.error('Penalty range error:', error.message);
    } else {
      console.error('Error generating text:', error);
    }
    throw error;
  }
}

// Export constants for external use
export const PENALTY_RANGE = {
  MIN: MIN_PENALTY,
  MAX: MAX_PENALTY
} as const; 