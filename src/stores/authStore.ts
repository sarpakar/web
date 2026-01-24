import { create } from 'zustand';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { UserProfile } from '@/types';

// Helper to normalize Firebase Storage URLs (remove :443 port if present)
function normalizePhotoURL(url: string | null | undefined): string | null {
  if (!url) return null;
  // Remove :443 port from Firebase Storage URLs (iOS app does this too)
  return url.replace('firebasestorage.googleapis.com:443', 'firebasestorage.googleapis.com');
}

// Helper to convert Firestore snake_case to camelCase UserProfile
function parseUserProfile(id: string, data: Record<string, any>): UserProfile {
  return {
    id,
    // Core fields - check both snake_case and camelCase
    phoneNumber: data.phone_number || data.phoneNumber || '',
    name: data.name || null,
    email: data.email || null,
    photoURL: normalizePhotoURL(data.photo_url || data.photoURL),
    
    // Gamification - check both snake_case and camelCase
    totalXP: data.total_xp || data.totalXP || 0,
    level: data.level || 1,
    characterType: data.character_type || data.characterType || null,
    restaurantPoints: data.restaurant_points || data.restaurantPoints || {},
    badges: data.badges || [],
    friends: data.friends || [],
    completedMatches: data.completed_matches || data.completedMatches || 0,
    matchesWon: data.matches_won || data.matchesWon || 0,
    episodesCreated: data.episodes_created || data.episodesCreated || 0,
    totalReactions: data.total_reactions || data.totalReactions || 0,
    
    // Settings
    notificationsEnabled: data.notifications_enabled ?? data.notificationsEnabled ?? true,
    fcmToken: data.fcm_token || data.fcmToken || null,
    hasCompletedOnboarding: data.has_completed_onboarding ?? data.hasCompletedOnboarding ?? false,
    
    // Timestamps
    createdAt: data.created_at?.toDate?.() || data.createdAt?.toDate?.() || new Date(),
    lastActive: data.last_active?.toDate?.() || data.lastActive?.toDate?.() || new Date(),
  };
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  fetchUserProfile: (uid: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  isAuthenticated: false,
  loading: true,
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setLoading: (loading) => set({ loading }),
  clearError: () => set({ error: null }),

  fetchUserProfile: async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📋 Raw Firestore data:', JSON.stringify({
          photo_url: data.photo_url,
          photoURL: data.photoURL,
          name: data.name,
          email: data.email,
        }, null, 2));

        const profile = parseUserProfile(docSnap.id, data);

        // If Firestore doesn't have a photo but Firebase Auth does, use Auth photo
        const authUser = get().user;
        if (!profile.photoURL && authUser?.photoURL) {
          profile.photoURL = normalizePhotoURL(authUser.photoURL);
          console.log('📸 Using Auth photo as fallback:', profile.photoURL);
        }

        set({ userProfile: profile });
        console.log('📸 Final profile photo:', profile.photoURL);
      } else {
        // Create a basic profile if one doesn't exist
        const user = get().user;
        if (user) {
          const newProfile: UserProfile = {
            id: uid,
            phoneNumber: user.phoneNumber || '',
            name: user.displayName || '',
            email: user.email || '',
            photoURL: normalizePhotoURL(user.photoURL),
            totalXP: 0,
            level: 1,
            restaurantPoints: {},
            badges: [],
            friends: [],
            completedMatches: 0,
            matchesWon: 0,
            episodesCreated: 0,
            totalReactions: 0,
            notificationsEnabled: true,
            createdAt: new Date(),
            lastActive: new Date(),
          };
          
          // Save to Firestore with snake_case field names
          await setDoc(userRef, {
            phone_number: newProfile.phoneNumber,
            name: newProfile.name,
            email: newProfile.email,
            photo_url: newProfile.photoURL,
            total_xp: 0,
            level: 1,
            restaurant_points: {},
            badges: [],
            friends: [],
            completed_matches: 0,
            matches_won: 0,
            episodes_created: 0,
            total_reactions: 0,
            notifications_enabled: true,
            created_at: serverTimestamp(),
            last_active: serverTimestamp(),
          });
          
          set({ userProfile: newProfile });
          console.log('📸 Created new profile with photo:', newProfile.photoURL);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      set({ user: result.user, isAuthenticated: true });
      await get().fetchUserProfile(result.user.uid);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      set({ user: result.user, isAuthenticated: true });
      await get().fetchUserProfile(result.user.uid);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signUpWithEmail: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (name && result.user) {
        await updateProfile(result.user, { displayName: name });
      }
      set({ user: result.user, isAuthenticated: true });
      await get().fetchUserProfile(result.user.uid);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({ user: null, userProfile: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

// Initialize auth state listener
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, async (user) => {
    useAuthStore.getState().setUser(user);
    if (user) {
      await useAuthStore.getState().fetchUserProfile(user.uid);
    } else {
      useAuthStore.getState().setUserProfile(null);
    }
    useAuthStore.getState().setLoading(false);
  });
}
