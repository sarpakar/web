import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SavedPost } from '@/types';

// ============================================================================
// Saved Post Service - Instagram Style
// ============================================================================

export class SavedPostService {
  private static instance: SavedPostService;

  static get shared() {
    if (!SavedPostService.instance) {
      SavedPostService.instance = new SavedPostService();
    }
    return SavedPostService.instance;
  }

  /**
   * Save a post
   */
  async savePost(
    userId: string,
    postId: string,
    collectionName?: string
  ): Promise<string> {
    const docRef = await addDoc(collection(db, 'saved_posts'), {
      userId,
      postId,
      collection: collectionName || 'All',
      timestamp: serverTimestamp(),
    });

    return docRef.id;
  }

  /**
   * Unsave a post
   */
  async unsavePost(userId: string, postId: string): Promise<void> {
    const q = query(
      collection(db, 'saved_posts'),
      where('userId', '==', userId),
      where('postId', '==', postId)
    );

    const snapshot = await getDocs(q);
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(docSnapshot.ref);
    }
  }

  /**
   * Check if a post is saved
   */
  async isPostSaved(userId: string, postId: string): Promise<boolean> {
    const q = query(
      collection(db, 'saved_posts'),
      where('userId', '==', userId),
      where('postId', '==', postId)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  /**
   * Get all saved posts for a user
   */
  async getSavedPosts(userId: string, collectionName?: string): Promise<SavedPost[]> {
    let q;

    if (collectionName) {
      q = query(
        collection(db, 'saved_posts'),
        where('userId', '==', userId),
        where('collection', '==', collectionName),
        orderBy('timestamp', 'desc')
      );
    } else {
      q = query(
        collection(db, 'saved_posts'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    } as SavedPost));
  }

  /**
   * Get saved post collections for a user
   */
  async getSavedCollections(userId: string): Promise<string[]> {
    const q = query(
      collection(db, 'saved_posts'),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    const collections = new Set<string>();

    snapshot.docs.forEach(doc => {
      const collection = doc.data().collection;
      if (collection) {
        collections.add(collection);
      }
    });

    return Array.from(collections);
  }

  /**
   * Move saved post to a different collection
   */
  async moveToCollection(
    userId: string,
    postId: string,
    newCollection: string
  ): Promise<void> {
    const q = query(
      collection(db, 'saved_posts'),
      where('userId', '==', userId),
      where('postId', '==', postId)
    );

    const snapshot = await getDocs(q);
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(docSnapshot.ref);
    }

    // Re-save with new collection
    await this.savePost(userId, postId, newCollection);
  }
}

export const savedPostService = SavedPostService.shared;
