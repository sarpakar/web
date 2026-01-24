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
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Comment } from '@/types';
import { notificationService } from './notificationService';

// ============================================================================
// Comment Service - Reddit/Instagram Style
// ============================================================================

export class CommentService {
  private static instance: CommentService;

  static get shared() {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService();
    }
    return CommentService.instance;
  }

  // MARK: - Comments

  /**
   * Fetch comments for a post (Reddit-style with nested replies)
   */
  async fetchComments(postId: string): Promise<Comment[]> {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      where('parentCommentId', '==', null), // Top-level comments only
      orderBy('likeCount', 'desc'), // Reddit-style: sort by likes
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
      editedAt: doc.data().editedAt?.toDate(),
    } as Comment));

    // Fetch replies for each comment
    for (const comment of comments) {
      comment.replies = await this.fetchReplies(comment.id!);
    }

    return comments;
  }

  /**
   * Fetch replies for a comment (nested)
   */
  async fetchReplies(commentId: string): Promise<Comment[]> {
    const q = query(
      collection(db, 'comments'),
      where('parentCommentId', '==', commentId),
      orderBy('timestamp', 'asc') // Chronological for replies
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
      editedAt: doc.data().editedAt?.toDate(),
    } as Comment));
  }

  /**
   * Create a comment
   */
  async createComment(
    postId: string,
    postOwnerId: string,
    userId: string,
    userName: string,
    userPhotoURL: string | undefined,
    content: string,
    parentCommentId?: string
  ): Promise<string> {
    const depth = parentCommentId ? 1 : 0; // Simple depth (can be enhanced)

    const docRef = await addDoc(collection(db, 'comments'), {
      postId,
      userId,
      userName,
      userPhotoURL,
      content,
      timestamp: serverTimestamp(),
      likeCount: 0,
      likedBy: [],
      parentCommentId: parentCommentId || null,
      replyCount: 0,
      isEdited: false,
      isDeleted: false,
      depth,
    });

    // Update post comment count
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      'engagement.comments': increment(1),
    });

    // Update parent comment reply count if this is a reply
    if (parentCommentId) {
      const parentRef = doc(db, 'comments', parentCommentId);
      await updateDoc(parentRef, {
        replyCount: increment(1),
      });

      // Get parent comment to notify its author
      const parentSnapshot = await getDocs(
        query(collection(db, 'comments'), where('__name__', '==', parentCommentId))
      );
      if (!parentSnapshot.empty) {
        const parentData = parentSnapshot.docs[0].data();

        // Notify parent comment author
        await notificationService.createNotification({
          type: 'comment_reply',
          recipientId: parentData.userId,
          senderId: userId,
          senderName: userName,
          senderPhotoURL: userPhotoURL,
          postId,
          commentId: docRef.id,
          message: `${userName} replied to your comment`,
        });
      }
    } else {
      // Notify post owner
      if (postOwnerId !== userId) {
        await notificationService.createNotification({
          type: 'post_comment',
          recipientId: postOwnerId,
          senderId: userId,
          senderName: userName,
          senderPhotoURL: userPhotoURL,
          postId,
          commentId: docRef.id,
          message: `${userName} commented on your post`,
        });
      }
    }

    return docRef.id;
  }

  /**
   * Edit a comment
   */
  async editComment(commentId: string, newContent: string): Promise<void> {
    const ref = doc(db, 'comments', commentId);
    await updateDoc(ref, {
      content: newContent,
      isEdited: true,
      editedAt: serverTimestamp(),
    });
  }

  /**
   * Delete a comment (soft delete)
   */
  async deleteComment(commentId: string, postId: string): Promise<void> {
    const ref = doc(db, 'comments', commentId);
    await updateDoc(ref, {
      content: '[deleted]',
      isDeleted: true,
    });

    // Update post comment count
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      'engagement.comments': increment(-1),
    });
  }

  /**
   * Like a comment
   */
  async likeComment(
    commentId: string,
    userId: string,
    userName: string,
    userPhotoURL: string | undefined,
    commentOwnerId: string,
    postId: string
  ): Promise<void> {
    const ref = doc(db, 'comments', commentId);
    await updateDoc(ref, {
      likedBy: arrayUnion(userId),
      likeCount: increment(1),
    });

    // Notify comment owner
    if (commentOwnerId !== userId) {
      await notificationService.createNotification({
        type: 'comment_like',
        recipientId: commentOwnerId,
        senderId: userId,
        senderName: userName,
        senderPhotoURL: userPhotoURL,
        postId,
        commentId,
        message: `${userName} liked your comment`,
      });
    }
  }

  /**
   * Unlike a comment
   */
  async unlikeComment(commentId: string, userId: string): Promise<void> {
    const ref = doc(db, 'comments', commentId);
    await updateDoc(ref, {
      likedBy: arrayRemove(userId),
      likeCount: increment(-1),
    });
  }
}

export const commentService = CommentService.shared;
