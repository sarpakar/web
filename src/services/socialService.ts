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
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post, FoodCommunity, FoodChallenge, RestaurantMeetup, GroupInvite } from '@/types';
import { notificationService } from './notificationService';

// ============================================================================
// Social Service - Matching iOS GroupsService.swift + OptimizedPostService.swift
// ============================================================================

export class SocialService {
  private static instance: SocialService;

  static get shared() {
    if (!SocialService.instance) {
      SocialService.instance = new SocialService();
    }
    return SocialService.instance;
  }

  // MARK: - Posts (Feed)

  async fetchFeed(limitCount: number = 20): Promise<Post[]> {
    const q = query(
      collection(db, 'posts'),
      where('isPublic', '==', true),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userPhotoURL: data.userAvatarURL, // Map from Firestore field
        videoURL: data.videoURL || '',
        thumbnailURL: data.primaryFeedURL || data.primaryImageURL || data.primaryThumbnailURL,
        duration: data.duration || 0,
        timestamp: data.date?.toDate(),
        status: 'ready',
        location: data.venueName,
        caption: data.caption || data.title,
        tags: data.tags || [],
        restaurantName: data.venueName,
        likedBy: data.likedBy || [],
        likeCount: data.likeCount || 0,
        engagement: {
          likes: data.likeCount || 0,
          views: 0,
          comments: data.commentCount || 0,
          shares: data.shareCount || 0,
          score: 0,
        },
        // Extra fields from Firestore
        title: data.title,
        mealType: data.mealType,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
      } as Post & { title?: string; mealType?: string; calories?: number; protein?: number; carbs?: number; fat?: number };
    });
  }

  async fetchUserPosts(userId: string): Promise<Post[]> {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    } as Post));
  }

  async likePost(
    postId: string,
    userId: string,
    userName: string,
    userPhotoURL: string | undefined,
    postOwnerId: string
  ): Promise<void> {
    const ref = doc(db, 'posts', postId);
    await updateDoc(ref, {
      likedBy: arrayUnion(userId),
      likeCount: increment(1),
      'engagement.likes': increment(1),
    });

    // Trigger notification to post owner
    if (postOwnerId !== userId) {
      await notificationService.createNotification({
        type: 'post_like',
        recipientId: postOwnerId,
        senderId: userId,
        senderName: userName,
        senderPhotoURL: userPhotoURL,
        postId,
        message: `${userName} liked your post`,
      });
    }
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    const ref = doc(db, 'posts', postId);
    await updateDoc(ref, {
      likedBy: arrayRemove(userId),
      likeCount: increment(-1),
      'engagement.likes': increment(-1),
    });
  }

  // MARK: - Communities

  async fetchCommunities(): Promise<FoodCommunity[]> {
    const q = query(
      collection(db, 'communities'),
      orderBy('memberCount', 'desc'),
      limit(30)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastActivityAt: doc.data().lastActivityAt?.toDate(),
    } as FoodCommunity));
  }

  async fetchMyCommunities(userId: string): Promise<FoodCommunity[]> {
    // First get membership
    const memberQuery = query(
      collection(db, 'community_members'),
      where('userId', '==', userId)
    );
    const memberSnapshot = await getDocs(memberQuery);
    const communityIds = memberSnapshot.docs.map(doc => doc.data().communityId);

    if (communityIds.length === 0) return [];

    // Then fetch communities
    const communitiesQuery = query(
      collection(db, 'communities'),
      where('__name__', 'in', communityIds)
    );
    const snapshot = await getDocs(communitiesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as FoodCommunity));
  }

  async joinCommunity(communityId: string, userId: string, userName: string, userAvatarURL?: string): Promise<void> {
    // Add member document
    await addDoc(collection(db, 'community_members'), {
      communityId,
      userId,
      userName,
      userAvatarURL,
      role: 'member',
      joinedAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
      postsCount: 0,
      challengesCompleted: 0,
    });

    // Update member count
    const ref = doc(db, 'communities', communityId);
    await updateDoc(ref, {
      memberCount: increment(1),
    });
  }

  async leaveCommunity(communityId: string, userId: string): Promise<void> {
    // Find and delete member document
    const q = query(
      collection(db, 'community_members'),
      where('communityId', '==', communityId),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(docSnapshot.ref);
    }

    // Update member count
    const ref = doc(db, 'communities', communityId);
    await updateDoc(ref, {
      memberCount: increment(-1),
    });
  }

  // MARK: - Challenges

  async fetchChallenges(): Promise<FoodChallenge[]> {
    const q = query(
      collection(db, 'challenges'),
      where('endDate', '>', Timestamp.fromDate(new Date())),
      orderBy('endDate', 'asc'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate(),
      endDate: doc.data().endDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    } as FoodChallenge));
  }

  async joinChallenge(challenge: FoodChallenge, userId: string, userName: string, userAvatarURL?: string): Promise<void> {
    if (!challenge.id) return;

    await addDoc(collection(db, 'challenge_participants'), {
      challengeId: challenge.id,
      userId,
      userName,
      userAvatarURL,
      currentValue: 0,
      goalValue: challenge.goalValue,
      status: 'active',
      joinedAt: serverTimestamp(),
    });

    const ref = doc(db, 'challenges', challenge.id);
    await updateDoc(ref, {
      participantCount: increment(1),
    });
  }

  // MARK: - Meetups

  async fetchMeetups(userId: string): Promise<RestaurantMeetup[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 1);

    // Fetch hosted meetups
    const hostedQuery = query(
      collection(db, 'meetups'),
      where('hostId', '==', userId),
      where('dateTime', '>', Timestamp.fromDate(cutoff)),
      orderBy('dateTime', 'asc')
    );
    const hostedSnapshot = await getDocs(hostedQuery);

    // Fetch invited meetups
    const invitedQuery = query(
      collection(db, 'meetups'),
      where('invitedUserIds', 'array-contains', userId),
      where('dateTime', '>', Timestamp.fromDate(cutoff)),
      orderBy('dateTime', 'asc')
    );
    const invitedSnapshot = await getDocs(invitedQuery);

    const hosted = hostedSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dateTime: doc.data().dateTime?.toDate(),
    } as RestaurantMeetup));

    const hostedIds = new Set(hosted.map(m => m.id));
    const invited = invitedSnapshot.docs
      .filter(doc => !hostedIds.has(doc.id))
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime?.toDate(),
      } as RestaurantMeetup));

    return [...hosted, ...invited].sort((a, b) => 
      (a.dateTime as Date).getTime() - (b.dateTime as Date).getTime()
    );
  }

  async createMeetup(meetup: Omit<RestaurantMeetup, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'meetups'), {
      ...meetup,
      dateTime: Timestamp.fromDate(meetup.dateTime as Date),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // MARK: - Invites

  async fetchInvites(userId: string): Promise<GroupInvite[]> {
    const q = query(
      collection(db, 'invites'),
      where('recipientId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    } as GroupInvite));
  }

  async respondToInvite(inviteId: string, accept: boolean): Promise<void> {
    const ref = doc(db, 'invites', inviteId);
    await updateDoc(ref, {
      status: accept ? 'accepted' : 'declined',
      respondedAt: serverTimestamp(),
    });
  }
}

export const socialService = SocialService.shared;



