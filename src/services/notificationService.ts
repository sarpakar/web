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
  writeBatch,
  DocumentReference,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Notification, NotificationType, Comment, Follow, SavedPost } from '@/types';

// ============================================================================
// Notification Service - Instagram/Reddit Style
// ============================================================================

export class NotificationService {
  private static instance: NotificationService;

  static get shared() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // MARK: - Notifications

  /**
   * Fetch notifications for a user (Instagram/Reddit style)
   */
  async fetchNotifications(userId: string, limitCount: number = 50): Promise<Notification[]> {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    } as Notification));
  }

  /**
   * Fetch unread notification count
   */
  async fetchUnreadCount(userId: string): Promise<number> {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      where('isRead', '==', false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const ref = doc(db, 'notifications', notificationId);
    await updateDoc(ref, {
      isRead: true,
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      where('isRead', '==', false)
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
  }

  /**
   * Create a notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Promise<string> {
    // Don't notify yourself
    if (notification.recipientId === notification.senderId) {
      return '';
    }

    // Check if similar notification exists (for aggregation)
    const groupKey = this.getGroupKey(notification);
    const existing = await this.findRecentSimilarNotification(
      notification.recipientId,
      groupKey,
      5 // Within last 5 minutes
    );

    if (existing) {
      // Aggregate with existing notification
      await this.aggregateNotification(existing.id!, notification);
      return existing.id!;
    }

    // Create new notification
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      isRead: false,
      timestamp: serverTimestamp(),
    });

    return docRef.id;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const ref = doc(db, 'notifications', notificationId);
    await deleteDoc(ref);
  }

  /**
   * Delete all notifications for a user
   */
  async deleteAllNotifications(userId: string): Promise<void> {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId)
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  // MARK: - Notification Helpers

  /**
   * Get grouping key for notification aggregation
   */
  private getGroupKey(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): string {
    switch (notification.type) {
      case 'post_like':
        return `post_like:${notification.postId}`;
      case 'post_comment':
        return `post_comment:${notification.postId}`;
      case 'comment_like':
        return `comment_like:${notification.commentId}`;
      case 'follow':
        return 'follow';
      default:
        return `${notification.type}:${notification.postId || notification.commentId || 'general'}`;
    }
  }

  /**
   * Find recent similar notification for aggregation
   */
  private async findRecentSimilarNotification(
    recipientId: string,
    groupKey: string,
    minutesAgo: number
  ): Promise<Notification | null> {
    const cutoff = new Date();
    cutoff.setMinutes(cutoff.getMinutes() - minutesAgo);

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', recipientId),
      where('isRead', '==', false),
      where('timestamp', '>', Timestamp.fromDate(cutoff)),
      limit(10)
    );

    const snapshot = await getDocs(q);

    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (this.getGroupKey(data as any) === groupKey) {
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate(),
        } as Notification;
      }
    }

    return null;
  }

  /**
   * Aggregate notification (Instagram-style)
   */
  private async aggregateNotification(
    existingId: string,
    newNotification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>
  ): Promise<void> {
    const ref = doc(db, 'notifications', existingId);
    const existing = await getDocs(query(collection(db, 'notifications'), where('__name__', '==', existingId)));

    if (existing.empty) return;

    const existingData = existing.docs[0].data() as Notification;

    // Build aggregated senders list
    const aggregatedSenders = existingData.aggregatedSenders || [
      {
        id: existingData.senderId,
        name: existingData.senderName,
        photoURL: existingData.senderPhotoURL,
      }
    ];

    // Add new sender if not already in list
    if (!aggregatedSenders.find(s => s.id === newNotification.senderId)) {
      aggregatedSenders.push({
        id: newNotification.senderId,
        name: newNotification.senderName,
        photoURL: newNotification.senderPhotoURL,
      });
    }

    const count = aggregatedSenders.length;

    // Generate aggregated message
    let message = '';
    if (count === 1) {
      message = newNotification.message;
    } else if (count === 2) {
      message = `${aggregatedSenders[0].name} and ${aggregatedSenders[1].name} ${this.getAggregatedAction(newNotification.type)}`;
    } else {
      const others = count - 1;
      message = `${aggregatedSenders[0].name} and ${others} ${others === 1 ? 'other' : 'others'} ${this.getAggregatedAction(newNotification.type)}`;
    }

    await updateDoc(ref, {
      isAggregated: true,
      aggregatedCount: count,
      aggregatedSenders,
      message,
      timestamp: serverTimestamp(), // Update to latest timestamp
    });
  }

  /**
   * Get aggregated action text
   */
  private getAggregatedAction(type: NotificationType): string {
    switch (type) {
      case 'post_like':
        return 'liked your post';
      case 'post_comment':
        return 'commented on your post';
      case 'comment_like':
        return 'liked your comment';
      case 'comment_reply':
        return 'replied to your comment';
      case 'follow':
        return 'started following you';
      default:
        return 'interacted with your content';
    }
  }

  // MARK: - Realtime Listeners

  /**
   * Listen to notifications in real-time
   */
  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): () => void {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      } as Notification));

      callback(notifications);
    });

    return unsubscribe;
  }
}

export const notificationService = NotificationService.shared;
