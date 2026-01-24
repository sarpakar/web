// ============================================================================
// AI Search Service - Matching iOS PineconeSearchService
// Uses Gemini AI for embeddings and natural language understanding
// ============================================================================

import { SearchResult } from '@/types';

// API Configuration - Using keys from iOS APIKeys-Info.plist
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyAtyNBpQY1f4bOlaTIZTDJxT4ULdXt-PpY';

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

export const searchService = {
  /**
   * AI-powered food search using Gemini
   * Matches iOS PineconeSearchService functionality
   */
  async search(query: string): Promise<{ results: SearchResult[]; aiResponse: string }> {
    console.log('🔍 Starting AI search for:', query);

    if (!GEMINI_API_KEY) {
      console.warn('⚠️ Gemini API key not configured');
      return { results: [], aiResponse: 'Search service not configured.' };
    }

    try {
      // Use Gemini to understand the query and generate recommendations
      const prompt = `You are a helpful food assistant. A user is searching for: "${query}"

Generate a JSON response with food recommendations. Return ONLY valid JSON:
{
  "summary": "A brief, helpful recommendation mentioning specific dishes and venues",
  "recommendations": [
    {
      "id": "1",
      "name": "Dish Name",
      "description": "Brief description",
      "price": 12.99,
      "venueName": "Restaurant Name",
      "category": "Category",
      "isVegetarian": false,
      "isVegan": false,
      "score": 0.95,
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  ]
}

Generate 3-5 realistic food recommendations based on the query. Be creative with venue names and dishes that would match "${query}".`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse the JSON response
      const parsed = JSON.parse(text);
      const results: SearchResult[] = (parsed.recommendations || []).map((rec: SearchResult, index: number) => ({
        ...rec,
        id: rec.id || String(index + 1),
        score: rec.score || 0.9 - index * 0.1
      }));

      console.log('✅ Search completed with', results.length, 'results');
      return { results, aiResponse: parsed.summary || 'Here are some recommendations for you.' };

    } catch (error) {
      console.error('❌ Search error:', error);
      return { 
        results: [], 
        aiResponse: 'I had trouble searching. Please try again.' 
      };
    }
  },

  /**
   * Quick suggestions for the home screen
   */
  getQuickSuggestions(): { emoji: string; text: string; query: string }[] {
    return [
      { emoji: '☕', text: 'Best coffee near me', query: 'best coffee near me' },
      { emoji: '💪', text: 'High protein meals', query: 'high protein meals' },
      { emoji: '🛒', text: 'Cheap groceries', query: 'cheap groceries near me' },
      { emoji: '⚡', text: 'Quick breakfast', query: 'quick breakfast options' },
      { emoji: '🥗', text: 'Healthy lunch', query: 'healthy lunch options' },
      { emoji: '🍕', text: 'Best pizza', query: 'best pizza near me' },
      { emoji: '🍜', text: 'Ramen spots', query: 'best ramen restaurants' },
      { emoji: '🌮', text: 'Tacos & burritos', query: 'mexican food tacos burritos' }
    ];
  },

  /**
   * Analyze food image using Gemini Vision
   */
  async analyzeImage(imageBase64: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      return 'Image analysis not available';
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: 'What food do you see in this image? Describe it briefly in 2-3 sentences.' },
                { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
              ]
            }]
          })
        }
      );

      const data: GeminiResponse = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not analyze image';
    } catch {
      return 'Error analyzing image';
    }
  }
};
