// ============================================================================
// Vector Search Service - Using Firestore Vector Search with Gemini Embeddings
// Based on: https://cloud.google.com/blog/products/databases/build-ai-powered-apps-with-firestore-vector-search
// ============================================================================

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { Post } from '@/types';

// Gemini API Configuration
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const EMBEDDING_MODEL = 'models/text-embedding-004';
const EMBEDDING_DIMENSION = 768;

interface GeminiEmbeddingResponse {
  embedding: {
    values: number[];
  };
}

/**
 * Generate embedding for text using Gemini API
 */
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          content: {
            parts: [{ text }]
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Embedding API error: ${response.status}`);
    }

    const data: GeminiEmbeddingResponse = await response.json();
    return data.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Create searchable text from post data
 */
function createSearchableText(post: DocumentData): string {
  const parts: string[] = [];

  if (post.title) parts.push(post.title);
  if (post.caption) parts.push(post.caption);
  if (post.venueName) parts.push(post.venueName);
  if (post.mealType) parts.push(post.mealType);

  // Add nutritional info if available
  if (post.protein) parts.push(`${post.protein}g protein`);
  if (post.calories) parts.push(`${post.calories} calories`);

  return parts.join(' ');
}

/**
 * Convert Firestore document to Post type
 */
function documentToPost(doc: DocumentData): Post {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId || '',
    userName: data.userName || 'Unknown',
    userPhotoURL: data.userAvatarURL || data.userPhotoURL,
    videoURL: data.videoURL || '',
    thumbnailURL: data.primaryThumbnailURL || data.thumbnailURL || '',
    duration: data.duration || 0,
    timestamp: data.date || data.createdAt || new Date(),
    status: 'ready',
    location: data.venueName || '',
    caption: data.caption || '',
    tags: data.tags || [],
    restaurantName: data.venueName,
    engagement: {
      likes: data.likeCount || 0,
      views: data.viewCount || 0,
      comments: data.commentCount || 0,
      shares: data.shareCount || 0,
      score: data.likeCount || 0
    },
    likedBy: data.likedBy || [],
    likeCount: data.likeCount || 0
  };
}

export const vectorSearchService = {
  /**
   * Search posts using vector similarity
   * Note: This requires Firestore vector index to be created first
   */
  async searchPosts(searchQuery: string, limit: number = 10): Promise<Post[]> {
    try {
      console.log('🔍 Searching posts for:', searchQuery);

      // Generate embedding for the search query
      const queryEmbedding = await generateEmbedding(searchQuery);

      console.log('✅ Generated query embedding with dimension:', queryEmbedding.length);

      // TODO: Once Firestore vector search is fully set up with indexes,
      // we'll use the findNearest query here. For now, fall back to traditional search.

      // Fallback: Search using traditional text matching
      const results = await this.fallbackTextSearch(searchQuery, limit);

      return results;

    } catch (error) {
      console.error('❌ Vector search error:', error);
      return [];
    }
  },

  /**
   * Fallback text search when vector search is not yet configured
   */
  async fallbackTextSearch(searchQuery: string, limit: number = 10): Promise<Post[]> {
    try {
      const postsRef = collection(db, 'posts');
      const postsSnapshot = await getDocs(query(postsRef));

      const allPosts = postsSnapshot.docs.map(documentToPost);

      // Filter posts that match the search query (case-insensitive)
      const lowerQuery = searchQuery.toLowerCase();
      const matchingPosts = allPosts.filter(post => {
        const searchText = `${post.caption} ${post.restaurantName} ${post.tags.join(' ')}`.toLowerCase();
        return searchText.includes(lowerQuery);
      });

      // Sort by engagement score
      matchingPosts.sort((a, b) => b.engagement.likes - a.engagement.likes);

      return matchingPosts.slice(0, limit);
    } catch (error) {
      console.error('Fallback search error:', error);
      return [];
    }
  },

  /**
   * Get AI-powered recommendations based on query
   */
  async getRecommendations(searchQuery: string): Promise<{ summary: string; posts: Post[] }> {
    try {
      // Use Gemini to understand the query and generate recommendations
      const prompt = `Based on this food search query: "${searchQuery}"

Generate a brief, helpful summary (1-2 sentences) that would help someone find what they're looking for.
Focus on specific food types, meal recommendations, or dining suggestions.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const summary = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Here are some posts that match your search.';

      // Get matching posts
      const posts = await this.searchPosts(searchQuery);

      return { summary, posts };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      const posts = await this.searchPosts(searchQuery);
      return { summary: 'Here are some posts that match your search.', posts };
    }
  },

  /**
   * Generate embedding for a post (for batch processing)
   */
  async generatePostEmbedding(post: DocumentData): Promise<number[]> {
    const searchableText = createSearchableText(post);
    return generateEmbedding(searchableText);
  }
};
