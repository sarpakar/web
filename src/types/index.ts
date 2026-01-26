// ============================================================================
// TypeScript Types - Matching iOS Swift Models
// ============================================================================

import { Timestamp } from 'firebase/firestore';

// MARK: - MealLogType
export type MealLogType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export const MealLogTypeInfo: Record<MealLogType, { emoji: string; sfSymbol: string; timeRange: string }> = {
  Breakfast: { emoji: '🌅', sfSymbol: 'sunrise.fill', timeRange: '6:00 AM - 10:00 AM' },
  Lunch: { emoji: '☀️', sfSymbol: 'sun.max.fill', timeRange: '11:00 AM - 2:00 PM' },
  Dinner: { emoji: '🌙', sfSymbol: 'moon.stars.fill', timeRange: '5:00 PM - 9:00 PM' },
  Snack: { emoji: '🍎', sfSymbol: 'carrot.fill', timeRange: 'Any time' },
};

// MARK: - MealLog
export interface MealLog {
  id?: string;
  userId: string;
  date: Date | Timestamp;
  mealType: MealLogType;
  time: string;
  
  // Venue
  venueId?: string;
  venueName: string;
  venueAddress?: string;
  latitude?: number;
  longitude?: number;
  
  // Details
  title: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  
  // Media (new architecture)
  mediaIds?: string[];
  mediaCount?: number;
  primaryImageURL?: string;
  primaryThumbnailURL?: string;
  primaryFeedURL?: string;
  
  // Legacy media
  photoURL?: string;
  thumbnailURL?: string;
  photoStoragePath?: string;
  
  // User input
  rating?: number;
  notes?: string;
  dietaryTags?: string[];
  
  // Metadata
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// MARK: - UserProfile
export interface UserProfile {
  id?: string;
  phoneNumber: string;
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;  // Can be from Firestore (photo_url) or Firebase Auth
  
  // Gamification
  totalXP: number;
  level: number;
  characterType?: CharacterType | null;
  restaurantPoints: Record<string, number>;
  badges: Badge[];
  friends: string[];
  completedMatches: number;
  matchesWon: number;
  episodesCreated: number;
  totalReactions: number;
  
  // Settings
  notificationsEnabled: boolean;
  fcmToken?: string | null;
  hasCompletedOnboarding?: boolean;
  
  createdAt: Date;
  lastActive: Date;
}

export type CharacterType = 
  | 'The Fearless Challenger'
  | 'The Squad Catalyst'
  | 'The Photo Artist'
  | 'The Vibe Creator'
  | 'The Loyalist'
  | 'The Explorer'
  | 'The Dramatist'
  | 'The Competitor';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  earnedAt: Date;
  description: string;
}

// MARK: - Link Embed (for sharing articles, recipes, videos)
export interface LinkEmbed {
  url: string;
  title: string;
  description?: string;
  imageURL?: string;
  siteName?: string;
  favicon?: string;
  type?: 'article' | 'video' | 'recipe' | 'restaurant' | 'other';
}

// MARK: - Fridge Item Embed (for sharing fridge items)
export interface FridgeItemEmbed {
  itemId: string;
  fridgeId: string;
  name: string;
  emoji: string;
  category: string;
  quantity: string;
  imageUrl?: string;
  expiryDays?: number;
  message?: 'available' | 'expiring' | 'trade' | 'recipe_idea';
}

// MARK: - Post
export interface Post {
  id?: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;

  videoURL?: string;
  thumbnailURL?: string;
  duration?: number;

  timestamp: Date | Timestamp;
  status: 'processing' | 'ready';
  location?: string;
  caption: string;
  tags: string[];

  restaurantName?: string;
  googlePlaceId?: string;
  isRestaurant?: boolean;
  cuisineType?: string;
  restaurant?: EmbeddedRestaurant;

  recipeId?: string;
  hasRecipe?: boolean;

  // Link embed support
  linkEmbed?: LinkEmbed;

  // Fridge item embed support
  fridgeItemEmbed?: FridgeItemEmbed;

  engagement: {
    likes: number;
    views: number;
    comments: number;
    shares: number;
    score: number;
  };

  likedBy?: string[];
  likeCount?: number;
}

export interface EmbeddedRestaurant {
  name?: string;
  address?: string;
  city?: string;
  rating?: number;
  totalRatings?: number;
  priceLevel?: string;
  phone?: string;
  website?: string;
  mapsURL?: string;
  latitude?: number;
  longitude?: number;
  hours?: string[];
}

// MARK: - FoodChallenge
export type ChallengeType = 'monthly' | 'distance' | 'streak' | 'calorie' | 'exploration' | 'social' | 'budget' | 'custom';
export type ChallengeStatus = 'upcoming' | 'active' | 'completed' | 'failed';

export interface FoodChallenge {
  id?: string;
  title: string;
  description: string;
  type: ChallengeType;
  imageURL?: string;
  bannerColor?: string;
  
  goalValue: number;
  goalUnit: string;
  currentValue?: number;
  
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  
  creatorId?: string;
  creatorName?: string;
  isOfficial: boolean;
  isGroupChallenge: boolean;
  maxParticipants?: number;
  participantCount: number;
  participantAvatars?: string[];
  
  badgeImageURL?: string;
  xpReward?: number;
  
  createdAt: Date | Timestamp;
  tags?: string[];
}

// MARK: - FoodCommunity
export type CommunityType = 'diet' | 'cuisine' | 'lifestyle' | 'location' | 'custom';

export interface FoodCommunity {
  id?: string;
  name: string;
  description: string;
  type: CommunityType;
  imageURL?: string;
  bannerURL?: string;
  
  creatorId: string;
  creatorName: string;
  memberCount: number;
  memberAvatars?: string[];
  isPrivate: boolean;
  isVerified: boolean;
  
  rules?: string[];
  tags?: string[];
  dietPlan?: DietPlan;
  
  postsCount: number;
  challengesCount: number;
  lastActivityAt?: Date | Timestamp;
  
  createdAt: Date | Timestamp;
}

export interface DietPlan {
  name: string;
  description: string;
  dailyCalories?: number;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  allowedFoods?: string[];
  restrictedFoods?: string[];
}

// MARK: - RestaurantMeetup
export type MeetupStatus = 'draft' | 'sent' | 'confirmed' | 'cancelled' | 'completed';
export type RSVPStatus = 'going' | 'maybe' | 'not_going' | 'pending';

export interface RestaurantMeetup {
  id?: string;
  title: string;
  description?: string;
  
  venueId?: string;
  venueName: string;
  venueAddress?: string;
  venueImageURL?: string;
  venueLatitude?: number;
  venueLongitude?: number;
  
  dateTime: Date | Timestamp;
  endTime?: Date | Timestamp;
  
  hostId: string;
  hostName: string;
  hostAvatarURL?: string;
  
  invitedUserIds: string[];
  maxGuests?: number;
  
  goingCount: number;
  maybeCount: number;
  notGoingCount: number;
  goingAvatars?: string[];
  
  status: MeetupStatus;
  
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  
  isPublic: boolean;
  shareLink?: string;
}

// MARK: - Vendor
export type VendorCategory = 'All' | 'Restaurants' | 'Groceries' | 'Convenience' | 'Cafés' | 'Desserts' | 'Alcohol';

export interface Vendor {
  id?: string;
  name: string;
  category: VendorCategory;
  cuisine?: string;
  imageURL: string;
  photoReference?: string;
  placeId?: string;
  applePlaceId?: string;
  googleMapsUri?: string;
  source?: string;
  
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder?: number;
  priceRange: string;
  latitude: number;
  longitude: number;
  address: string;
  isOpen: boolean;
  tags: string[];
  
  waitStatus?: 'Confident (No wait)' | 'Short wait (5-10 min)' | 'Medium wait (15-20 min)' | 'Long wait (30+ min)';
  dietaryHighlights?: string[];
  vibeTraits?: string[];
}

// MARK: - Recipe
export interface Recipe {
  id: string;
  name: string;
  description: string;
  emojiCombo: string;
  cookTime: string;
  protein?: string;
  calories?: string;
  difficulty: string;
  mealType: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  isRecommended: boolean;
  
  imageUrl?: string;
  videoUrl?: string;
  servings?: number;
  cuisine?: string;
  matchScore?: number;
  missingIngredients?: string[];
  pantryItems?: string[];
  utensils?: string[];
  source?: string;
}

export interface RecipeIngredient {
  name: string;
  amount?: string;
  inFridge?: boolean;
  isPantry?: boolean;
  emoji?: string;
}

// MARK: - Group Invite
export interface GroupInvite {
  id?: string;
  type: 'challenge' | 'community' | 'meetup';
  targetId: string;
  targetName: string;
  targetImageURL?: string;
  
  senderId: string;
  senderName: string;
  senderAvatarURL?: string;
  
  recipientId: string;
  
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  
  createdAt: Date | Timestamp;
  respondedAt?: Date | Timestamp;
}

// MARK: - Search Result (AI Search)
export interface SearchResult {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  venueName?: string;
  venueId?: string;
  imageUrl?: string;
  score: number;
  reviewBoost?: number;
  dietaryTags?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  containsGluten?: boolean;
  latitude?: number;
  longitude?: number;
}

// MARK: - Chat Message (AI Search)
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  searchResults?: SearchResult[];
}

// MARK: - Notifications (Reddit/Instagram Style)
export type NotificationType =
  | 'post_like'           // Someone liked your post
  | 'post_comment'        // Someone commented on your post
  | 'comment_reply'       // Someone replied to your comment
  | 'comment_like'        // Someone liked your comment
  | 'follow'              // Someone followed you
  | 'mention'             // Someone mentioned you (@username)
  | 'community_invite'    // Invited to a community
  | 'challenge_invite'    // Invited to a challenge
  | 'meetup_invite'       // Invited to a meetup
  | 'achievement'         // Earned a badge/achievement
  | 'daily_streak'        // Daily login streak
  | 'trending_post'       // Your post is trending
  | 'system';             // System notifications

export interface Notification {
  id?: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderPhotoURL?: string;

  type: NotificationType;

  // Related entities
  postId?: string;
  commentId?: string;
  communityId?: string;
  challengeId?: string;
  meetupId?: string;

  // Content
  message: string;
  actionUrl?: string;
  thumbnailURL?: string;

  // Status
  isRead: boolean;
  timestamp: Date | Timestamp;

  // Aggregation (Instagram-style)
  isAggregated?: boolean;
  aggregatedCount?: number;
  aggregatedSenders?: {
    id: string;
    name: string;
    photoURL?: string;
  }[];
}

// MARK: - Comments (Reddit Style)
export interface Comment {
  id?: string;
  postId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;

  content: string;
  timestamp: Date | Timestamp;

  // Engagement
  likeCount: number;
  likedBy: string[];

  // Reddit-style nested replies
  parentCommentId?: string;
  replyCount: number;
  replies?: Comment[];

  // Moderation
  isEdited: boolean;
  editedAt?: Date | Timestamp;
  isDeleted: boolean;

  // Metadata
  depth: number;  // 0 = top-level, 1 = first reply, etc.
}

// MARK: - Follows (Instagram Style)
export interface Follow {
  id?: string;
  followerId: string;
  followerName: string;
  followerPhotoURL?: string;

  followingId: string;
  followingName: string;
  followingPhotoURL?: string;

  timestamp: Date | Timestamp;
  notificationsEnabled: boolean;
}

// MARK: - Saved Posts
export interface SavedPost {
  id?: string;
  userId: string;
  postId: string;
  timestamp: Date | Timestamp;
  collection?: string;  // For organizing saved posts
}

// MARK: - User Stats (for profile)
export interface UserStats {
  userId: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  totalLikes: number;
  totalComments: number;
  lastUpdated: Date | Timestamp;
}

