// ============================================================================
// AI Search Service - Matching iOS PineconeSearchService
// Uses server-side API routes for Gemini AI to protect API keys
// ============================================================================

import { SearchResult } from '@/types';
import { auth } from '@/lib/firebase';
import logger from '@/lib/logger';

/**
 * Get the current user's Firebase ID token for API authentication
 */
async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch (error) {
    logger.error('Failed to get auth token:', error);
    return null;
  }
}

export const searchService = {
  /**
   * AI-powered food search using server-side Gemini API
   * Matches iOS PineconeSearchService functionality
   */
  async search(query: string): Promise<{ results: SearchResult[]; aiResponse: string }> {
    logger.log('🔍 Starting AI search for:', query);

    const token = await getAuthToken();
    if (!token) {
      logger.warn('⚠️ User not authenticated');
      return { results: [], aiResponse: 'Please sign in to search.' };
    }

    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query, type: 'search' })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error('API error:', response.status, errorData);
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      // Parse recommendations from response
      const results: SearchResult[] = (data.recommendations || []).map((rec: SearchResult, index: number) => ({
        ...rec,
        id: rec.id || String(index + 1),
        score: rec.score || 0.9 - index * 0.1
      }));

      logger.log('✅ Search completed with', results.length, 'results');
      return {
        results,
        aiResponse: data.summary || 'Here are some recommendations for you.'
      };

    } catch (error) {
      logger.error('❌ Search error:', error);
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
   * Analyze food image using server-side Gemini Vision API
   */
  async analyzeImage(imageBase64: string): Promise<string> {
    const token = await getAuthToken();
    if (!token) {
      return 'Please sign in to analyze images.';
    }

    try {
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageBase64 })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis || 'Could not analyze image';
    } catch (error) {
      logger.error('Image analysis error:', error);
      return 'Error analyzing image';
    }
  },

  /**
   * Generate text embeddings using server-side API
   * Used for vector search functionality
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const token = await getAuthToken();
    if (!token) {
      logger.warn('User not authenticated for embedding generation');
      return [];
    }

    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: text, type: 'embedding' })
      });

      if (!response.ok) {
        throw new Error(`Embedding API error: ${response.status}`);
      }

      const data = await response.json();
      return data.embedding || [];
    } catch (error) {
      logger.error('Embedding generation error:', error);
      return [];
    }
  }
};
