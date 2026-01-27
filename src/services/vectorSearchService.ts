// ============================================================================
// Vector Search Service - Using Firestore Vector Search with Gemini Embeddings
// Based on: https://cloud.google.com/blog/products/databases/build-ai-powered-apps-with-firestore-vector-search
// Uses server-side API routes to protect API keys
// ============================================================================

import { db, auth } from '@/lib/firebase';
import { collection, query, getDocs, DocumentData } from 'firebase/firestore';
import { Post } from '@/types';
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

/**
 * Generate embedding for text using server-side API
 */
async function generateEmbedding(text: string): Promise<number[]> {
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
    logger.error('Error generating embedding:', error);
    return [];
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
      logger.log('🔍 Searching posts for:', searchQuery);

      // Generate embedding for the search query
      const queryEmbedding = await generateEmbedding(searchQuery);

      if (queryEmbedding.length > 0) {
        logger.log('✅ Generated query embedding with dimension:', queryEmbedding.length);
      }

      // TODO: Once Firestore vector search is fully set up with indexes,
      // we'll use the findNearest query here. For now, fall back to traditional search.

      // Fallback: Search using traditional text matching
      const results = await this.fallbackTextSearch(searchQuery, limit);

      return results;

    } catch (error) {
      logger.error('❌ Vector search error:', error);
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
      logger.error('Fallback search error:', error);
      return [];
    }
  },

  /**
   * Get AI-powered recommendations based on query
   * Uses server-side API to protect API keys
   */
  async getRecommendations(searchQuery: string): Promise<{ summary: string; posts: Post[] }> {
    try {
      const token = await getAuthToken();
      if (!token) {
        const posts = await this.searchPosts(searchQuery);
        return { summary: 'Please sign in for AI-powered recommendations.', posts };
      }

      // Use the server-side API for recommendations
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: searchQuery, type: 'search' })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const summary = data.summary || 'Here are some posts that match your search.';

      // Get matching posts from Firestore
      const posts = await this.searchPosts(searchQuery);

      return { summary, posts };
    } catch (error) {
      logger.error('Error getting recommendations:', error);
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
