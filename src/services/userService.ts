// ============================================================================
// User Service - Firestore User Profile Management
// Matches iOS AuthStateManager + UserData model
// ============================================================================

import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { UserProfile } from '@/types';

const USERS_COLLECTION = 'users';

export class UserService {
  private static instance: UserService;
  private userListener: (() => void) | null = null;

  static get shared() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          phoneNumber: data.phoneNumber || '',
          name: data.name || data.displayName,
          email: data.email,
          photoURL: data.photoURL || data.photo_url,
          totalXP: data.totalXP || 0,
          level: data.level || 1,
          characterType: data.characterType,
          restaurantPoints: data.restaurantPoints || {},
          badges: data.badges || [],
          friends: data.friends || [],
          completedMatches: data.completedMatches || 0,
          matchesWon: data.matchesWon || 0,
          episodesCreated: data.episodesCreated || 0,
          totalReactions: data.totalReactions || 0,
          notificationsEnabled: data.notificationsEnabled ?? true,
          fcmToken: data.fcmToken,
          hasCompletedOnboarding: data.hasCompletedOnboarding ?? false,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          lastActive: data.lastActive?.toDate?.() || new Date(),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Create or update user profile after authentication
   */
  async createOrUpdateUser(userId: string, userData: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Update existing user
        await updateDoc(docRef, {
          ...userData,
          lastActive: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new user with defaults
        await setDoc(docRef, {
          phoneNumber: userData.phoneNumber || '',
          name: userData.name || '',
          email: userData.email || '',
          photoURL: userData.photoURL || null,
          totalXP: 0,
          level: 1,
          characterType: null,
          restaurantPoints: {},
          badges: [],
          friends: [],
          completedMatches: 0,
          matchesWon: 0,
          episodesCreated: 0,
          totalReactions: 0,
          notificationsEnabled: true,
          hasCompletedOnboarding: false,
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
          ...userData,
        });
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  }

  /**
   * Update user's last active timestamp
   */
  async updateLastActive(userId: string): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(docRef, {
        lastActive: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating last active:', error);
    }
  }

  /**
   * Mark onboarding as complete
   */
  async completeOnboarding(userId: string, onboardingData?: {
    universityId?: string;
    universityName?: string;
    dietaryRestrictions?: string[];
    foodGoal?: string;
    weeklyBudget?: number;
    likedCuisines?: string[];
  }): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(docRef, {
        hasCompletedOnboarding: true,
        ...onboardingData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time user profile updates
   */
  subscribeToUserProfile(userId: string, callback: (profile: UserProfile | null) => void): () => void {
    const docRef = doc(db, USERS_COLLECTION, userId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          id: docSnap.id,
          phoneNumber: data.phoneNumber || '',
          name: data.name || data.displayName,
          email: data.email,
          photoURL: data.photoURL || data.photo_url,
          totalXP: data.totalXP || 0,
          level: data.level || 1,
          characterType: data.characterType,
          restaurantPoints: data.restaurantPoints || {},
          badges: data.badges || [],
          friends: data.friends || [],
          completedMatches: data.completedMatches || 0,
          matchesWon: data.matchesWon || 0,
          episodesCreated: data.episodesCreated || 0,
          totalReactions: data.totalReactions || 0,
          notificationsEnabled: data.notificationsEnabled ?? true,
          fcmToken: data.fcmToken,
          hasCompletedOnboarding: data.hasCompletedOnboarding ?? false,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          lastActive: data.lastActive?.toDate?.() || new Date(),
        } as UserProfile);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error in user profile listener:', error);
      callback(null);
    });

    this.userListener = unsubscribe;
    return unsubscribe;
  }

  /**
   * Cleanup listeners
   */
  cleanup(): void {
    if (this.userListener) {
      this.userListener();
      this.userListener = null;
    }
  }
}

export const userService = UserService.shared;
