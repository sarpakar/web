import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  increment,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Follow } from '@/types';
import { notificationService } from './notificationService';

// ============================================================================
// Follow Service - Instagram Style
// ============================================================================

export class FollowService {
  private static instance: FollowService;

  static get shared() {
    if (!FollowService.instance) {
      FollowService.instance = new FollowService();
    }
    return FollowService.instance;
  }

  /**
   * Follow a user
   */
  async followUser(
    followerId: string,
    followerName: string,
    followerPhotoURL: string | undefined,
    followingId: string,
    followingName: string,
    followingPhotoURL: string | undefined
  ): Promise<void> {
    // Don't follow yourself
    if (followerId === followingId) return;

    // Create follow document
    await addDoc(collection(db, 'follows'), {
      followerId,
      followerName,
      followerPhotoURL,
      followingId,
      followingName,
      followingPhotoURL,
      timestamp: serverTimestamp(),
      notificationsEnabled: true,
    });

    // Update follower count in user stats
    const followingStatsRef = doc(db, 'user_stats', followingId);
    const followerStatsRef = doc(db, 'user_stats', followerId);

    // Check if stats exist, if not create them
    const followingStatsSnap = await getDoc(followingStatsRef);
    if (!followingStatsSnap.exists()) {
      await addDoc(collection(db, 'user_stats'), {
        userId: followingId,
        followerCount: 1,
        followingCount: 0,
        postCount: 0,
        totalLikes: 0,
        totalComments: 0,
        lastUpdated: serverTimestamp(),
      });
    } else {
      await updateDoc(followingStatsRef, {
        followerCount: increment(1),
        lastUpdated: serverTimestamp(),
      });
    }

    const followerStatsSnap = await getDoc(followerStatsRef);
    if (!followerStatsSnap.exists()) {
      await addDoc(collection(db, 'user_stats'), {
        userId: followerId,
        followerCount: 0,
        followingCount: 1,
        postCount: 0,
        totalLikes: 0,
        totalComments: 0,
        lastUpdated: serverTimestamp(),
      });
    } else {
      await updateDoc(followerStatsRef, {
        followingCount: increment(1),
        lastUpdated: serverTimestamp(),
      });
    }

    // Notify the user being followed
    await notificationService.createNotification({
      type: 'follow',
      recipientId: followingId,
      senderId: followerId,
      senderName: followerName,
      senderPhotoURL: followerPhotoURL,
      message: `${followerName} started following you`,
    });
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    // Find and delete follow document
    const q = query(
      collection(db, 'follows'),
      where('followerId', '==', followerId),
      where('followingId', '==', followingId)
    );

    const snapshot = await getDocs(q);
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(docSnapshot.ref);
    }

    // Update follower counts
    const followingStatsRef = doc(db, 'user_stats', followingId);
    const followerStatsRef = doc(db, 'user_stats', followerId);

    await updateDoc(followingStatsRef, {
      followerCount: increment(-1),
      lastUpdated: serverTimestamp(),
    });

    await updateDoc(followerStatsRef, {
      followingCount: increment(-1),
      lastUpdated: serverTimestamp(),
    });
  }

  /**
   * Check if user is following another user
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const q = query(
      collection(db, 'follows'),
      where('followerId', '==', followerId),
      where('followingId', '==', followingId)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  /**
   * Get followers of a user
   */
  async getFollowers(userId: string): Promise<Follow[]> {
    const q = query(
      collection(db, 'follows'),
      where('followingId', '==', userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    } as Follow));
  }

  /**
   * Get users that a user is following
   */
  async getFollowing(userId: string): Promise<Follow[]> {
    const q = query(
      collection(db, 'follows'),
      where('followerId', '==', userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    } as Follow));
  }

  /**
   * Get follower/following counts for a user
   */
  async getUserStats(userId: string): Promise<{
    followerCount: number;
    followingCount: number;
  }> {
    const followersQ = query(
      collection(db, 'follows'),
      where('followingId', '==', userId)
    );
    const followingQ = query(
      collection(db, 'follows'),
      where('followerId', '==', userId)
    );

    const [followersSnap, followingSnap] = await Promise.all([
      getDocs(followersQ),
      getDocs(followingQ),
    ]);

    return {
      followerCount: followersSnap.size,
      followingCount: followingSnap.size,
    };
  }
}

export const followService = FollowService.shared;
