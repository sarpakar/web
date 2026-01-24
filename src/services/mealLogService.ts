import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MealLog, MealLogType } from '@/types';

// ============================================================================
// Meal Log Service - Matching iOS MealLogService.swift
// ============================================================================

// Helper to normalize Firebase Storage URLs (remove :443 port if present)
function normalizeURL(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return url.replace('firebasestorage.googleapis.com:443', 'firebasestorage.googleapis.com');
}

// Parse Firestore document to MealLog with normalized URLs
function parseMealLog(docId: string, data: Record<string, any>): MealLog {
  const meal: MealLog = {
    id: docId,
    userId: data.userId,
    date: data.date?.toDate?.() || data.date,
    mealType: data.mealType,
    time: data.time,
    
    // Venue
    venueId: data.venueId,
    venueName: data.venueName || '',
    venueAddress: data.venueAddress,
    latitude: data.latitude,
    longitude: data.longitude,
    
    // Details
    title: data.title || '',
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fat: data.fat,
    
    // Media (new architecture) - normalize URLs
    mediaIds: data.mediaIds,
    mediaCount: data.mediaCount,
    primaryImageURL: normalizeURL(data.primaryImageURL),
    primaryThumbnailURL: normalizeURL(data.primaryThumbnailURL),
    primaryFeedURL: normalizeURL(data.primaryFeedURL),
    
    // Legacy media - normalize URLs
    photoURL: normalizeURL(data.photoURL),
    thumbnailURL: normalizeURL(data.thumbnailURL),
    photoStoragePath: data.photoStoragePath,
    
    // User input
    rating: data.rating,
    notes: data.notes,
    dietaryTags: data.dietaryTags,
    
    // Metadata
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
  
  // Debug logging
  const imageUrl = meal.primaryFeedURL || meal.primaryImageURL || meal.primaryThumbnailURL || meal.thumbnailURL || meal.photoURL;
  if (imageUrl) {
    console.log(`📸 Meal "${meal.title}" image:`, imageUrl);
  }
  
  return meal;
}

export class MealLogService {
  private static instance: MealLogService;
  private unsubscribers: (() => void)[] = [];

  static get shared() {
    if (!MealLogService.instance) {
      MealLogService.instance = new MealLogService();
    }
    return MealLogService.instance;
  }

  // MARK: - Fetch Methods

  async fetchMealsForDate(userId: string, date: Date): Promise<MealLog[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'mealLogs'),
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);
    console.log(`📋 Fetched ${snapshot.docs.length} meals for date`);
    return snapshot.docs.map(doc => parseMealLog(doc.id, doc.data()));
  }

  async fetchWeeklyMeals(userId: string): Promise<Map<string, MealLog[]>> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 3);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 4);
    endOfWeek.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'mealLogs'),
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startOfWeek)),
      where('date', '<=', Timestamp.fromDate(endOfWeek)),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);
    const grouped = new Map<string, MealLog[]>();

    snapshot.docs.forEach(docSnap => {
      const meal = parseMealLog(docSnap.id, docSnap.data());
      const dateKey = new Date(meal.date as Date).toISOString().split('T')[0];
      const existing = grouped.get(dateKey) || [];
      grouped.set(dateKey, [...existing, meal]);
    });

    return grouped;
  }

  async fetchRecentMeals(userId: string, count: number = 10): Promise<MealLog[]> {
    console.log(`🔍 Fetching ${count} recent meals for user:`, userId);
    
    const q = query(
      collection(db, 'mealLogs'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(count)
    );

    const snapshot = await getDocs(q);
    console.log(`📋 Fetched ${snapshot.docs.length} meals`);
    
    const meals = snapshot.docs.map(docSnap => parseMealLog(docSnap.id, docSnap.data()));
    
    // Log image URLs for debugging
    meals.forEach(meal => {
      const imgUrl = meal.primaryFeedURL || meal.primaryImageURL || meal.primaryThumbnailURL || meal.thumbnailURL || meal.photoURL;
      console.log(`  - "${meal.title}": ${imgUrl ? '✅ has image' : '❌ no image'}`);
    });
    
    return meals;
  }

  // MARK: - Real-time Listeners

  subscribeToTodaysMeals(userId: string, callback: (meals: MealLog[]) => void): () => void {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'mealLogs'),
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meals = snapshot.docs.map(docSnap => parseMealLog(docSnap.id, docSnap.data()));
      callback(meals);
    });

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  // MARK: - CRUD Operations

  async createMealLog(mealLog: Omit<MealLog, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'mealLogs'), {
      ...mealLog,
      date: Timestamp.fromDate(mealLog.date as Date),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async updateMealLog(id: string, updates: Partial<MealLog>): Promise<void> {
    const ref = doc(db, 'mealLogs', id);
    await updateDoc(ref, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteMealLog(id: string): Promise<void> {
    const ref = doc(db, 'mealLogs', id);
    await deleteDoc(ref);
  }

  // MARK: - Helper Methods

  static suggestedMealType(date: Date = new Date()): MealLogType {
    const hour = date.getHours();
    if (hour >= 6 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 15) return 'Lunch';
    if (hour >= 17 && hour < 22) return 'Dinner';
    return 'Snack';
  }

  static formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  }

  // Cleanup
  cleanup() {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
  }
}

export const mealLogService = MealLogService.shared;
