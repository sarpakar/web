# Campus Meals Database Schema Analysis
## Comparison with Reddit/Instagram Best Practices

### ✅ **Current Schema Strengths**

#### 1. **Posts Collection** - GOOD FOUNDATION
```typescript
interface Post {
  id: string
  userId: string
  userName: string
  userPhotoURL?: string

  videoURL: string
  thumbnailURL?: string
  duration: number

  timestamp: Date
  status: 'processing' | 'ready'
  location?: string
  caption: string
  tags: string[]

  engagement: {
    likes: number
    views: number
    comments: number
    shares: number
    score: number
  }

  likedBy?: string[]
  likeCount?: number
}
```

**✅ Reddit/Instagram Alignment:**
- ✅ Engagement metrics (likes, comments, shares, views)
- ✅ likedBy array for quick like status check
- ✅ Denormalized user data (userName, userPhotoURL) for fast rendering
- ✅ Tags for content discovery
- ✅ Timestamp for chronological ordering

---

### ⚠️ **Missing Critical Features (Reddit/Instagram Standard)**

#### 1. **Comments System** - MISSING ❌
```
Collections Needed:
├── comments/
│   ├── {commentId}
│   │   ├── postId: string
│   │   ├── userId: string
│   │   ├── userName: string
│   │   ├── userPhotoURL: string
│   │   ├── content: string
│   │   ├── timestamp: Timestamp
│   │   ├── likeCount: number
│   │   ├── likedBy: string[]
│   │   ├── replyCount: number
│   │   ├── parentCommentId?: string (for nested replies)
│   │   ├── isEdited: boolean
│   │   ├── editedAt?: Timestamp
│   │   └── isDeleted: boolean
```

#### 2. **Notifications System** - MISSING ❌
```
Collections Needed:
├── notifications/
│   ├── {notificationId}
│   │   ├── recipientId: string
│   │   ├── senderId: string
│   │   ├── senderName: string
│   │   ├── senderPhotoURL?: string
│   │   ├── type: NotificationType
│   │   ├── postId?: string
│   │   ├── commentId?: string
│   │   ├── communityId?: string
│   │   ├── message: string
│   │   ├── timestamp: Timestamp
│   │   ├── isRead: boolean
│   │   └── actionUrl?: string
```

**Notification Types:**
```typescript
type NotificationType =
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
```

#### 3. **Follows/Social Graph** - MISSING ❌
```
Collections Needed:
├── follows/
│   ├── {followId}
│   │   ├── followerId: string
│   │   ├── followerName: string
│   │   ├── followerPhotoURL?: string
│   │   ├── followingId: string
│   │   ├── followingName: string
│   │   ├── followingPhotoURL?: string
│   │   ├── timestamp: Timestamp
│   │   └── notificationsEnabled: boolean

├── user_stats/ (subcollection under users)
│   ├── followerCount: number
│   ├── followingCount: number
│   ├── postCount: number
│   ├── totalLikes: number
│   └── lastUpdated: Timestamp
```

#### 4. **Saved/Bookmarked Posts** - PARTIALLY IMPLEMENTED ⚠️
```
Current: Only client-side state
Needed:
├── saved_posts/
│   ├── {saveId}
│   │   ├── userId: string
│   │   ├── postId: string
│   │   ├── timestamp: Timestamp
│   │   └── collection?: string (for organizing saves)
```

#### 5. **User Presence/Activity** - MISSING ❌
```
├── user_activity/
│   ├── {userId}
│   │   ├── lastActive: Timestamp
│   │   ├── isOnline: boolean
│   │   ├── currentlyViewing?: string (postId/page)
│   │   └── fcmTokens: string[] (for push notifications)
```

---

### 📊 **Enhanced Post Schema (Reddit-Style)**

```typescript
interface EnhancedPost extends Post {
  // Reddit-style voting
  upvoteCount: number
  downvoteCount: number
  voteScore: number  // upvotes - downvotes
  upvotedBy: string[]
  downvotedBy: string[]

  // Instagram-style features
  isSponsored: boolean
  sponsorName?: string

  // Reddit-style awards
  awards: Award[]
  awardCount: number

  // Content moderation
  isRemoved: boolean
  removalReason?: string
  reportCount: number
  isNSFW: boolean
  isSpoiler: boolean

  // Engagement algorithms (Reddit/Instagram)
  hotScore: number      // Time-decay algorithm
  controversyScore: number  // upvotes vs downvotes ratio
  trendingScore: number

  // Cross-posting (Reddit feature)
  originalPostId?: string
  crosspostCount: number

  // Instagram-style features
  location: {
    name: string
    coordinates?: { lat: number; lng: number }
    placeId?: string
  }

  // Better media handling
  media: {
    type: 'image' | 'video' | 'carousel'
    urls: string[]
    thumbnails: string[]
    aspectRatio?: number
    duration?: number
  }

  // Enhanced metadata
  editHistory: {
    editedAt: Timestamp
    reason?: string
  }[]
  isPinned: boolean
  isArchived: boolean
}
```

---

### 🔔 **Notification System Architecture**

#### **Real-time vs Batch Notifications**

```typescript
// Cloud Function triggers
exports.onPostLiked = functions.firestore
  .document('posts/{postId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data()
    const after = change.after.data()

    // Detect new likes
    const newLikes = after.likedBy.filter(
      (uid: string) => !before.likedBy.includes(uid)
    )

    for (const likerId of newLikes) {
      await createNotification({
        type: 'post_like',
        recipientId: after.userId,
        senderId: likerId,
        postId: context.params.postId,
        message: `${await getUserName(likerId)} liked your post`,
      })
    }
  })

exports.onCommentCreated = functions.firestore
  .document('comments/{commentId}')
  .onCreate(async (snap, context) => {
    const comment = snap.data()

    await createNotification({
      type: 'post_comment',
      recipientId: comment.postOwnerId,
      senderId: comment.userId,
      postId: comment.postId,
      commentId: context.params.commentId,
      message: `${comment.userName} commented on your post`,
    })
  })
```

#### **Notification Aggregation (Instagram-style)**

```typescript
// Instead of: "John liked your post", "Jane liked your post", "Bob liked your post"
// Show: "John, Jane, Bob and 10 others liked your post"

interface AggregatedNotification {
  type: NotificationType
  recipientId: string
  senders: {
    id: string
    name: string
    photoURL?: string
  }[]
  totalCount: number
  latestTimestamp: Timestamp
  groupKey: string  // e.g., "post_like:postId123"
  message: string   // "John, Jane and 10 others liked your post"
}
```

---

### 🎯 **Recommendations for Production**

#### **Priority 1: Immediate Implementation**
1. ✅ **Comments Collection** - Core social feature
2. ✅ **Notifications Collection** - User engagement
3. ✅ **Follows System** - Social graph
4. ✅ **Saved Posts** - User retention

#### **Priority 2: Enhanced Features**
5. ⚠️ **Vote System** (Reddit-style upvotes/downvotes)
6. ⚠️ **Notification Aggregation** (Instagram-style)
7. ⚠️ **User Presence** (Online/offline status)
8. ⚠️ **Post Awards** (Reddit-style awards)

#### **Priority 3: Advanced**
9. 🔵 **Trending Algorithm** (Hot/Trending scores)
10. 🔵 **Cross-posting**
11. 🔵 **Edit History**
12. 🔵 **Content Moderation**

---

### 📝 **Database Indexes Required**

```javascript
// Firestore Indexes

// Comments
comments: {
  postId: 'ASC',
  timestamp: 'DESC'
}

// Notifications
notifications: {
  recipientId: 'ASC',
  isRead: 'ASC',
  timestamp: 'DESC'
}

// Follows
follows: {
  followerId: 'ASC',
  timestamp: 'DESC'
}
follows: {
  followingId: 'ASC',
  timestamp: 'DESC'
}

// Saved Posts
saved_posts: {
  userId: 'ASC',
  timestamp: 'DESC'
}
```

---

### 🎨 **Current vs Ideal Schema Comparison**

| Feature | Current Status | Reddit/Instagram Standard | Priority |
|---------|----------------|--------------------------|----------|
| Posts | ✅ Good | ✅ Excellent | ✅ Done |
| Likes | ✅ Implemented | ✅ Complete | ✅ Done |
| Comments | ❌ Missing | ✅ Essential | 🔴 P1 |
| Notifications | ❌ Missing | ✅ Essential | 🔴 P1 |
| Follows | ❌ Missing | ✅ Essential | 🔴 P1 |
| Saved Posts | ⚠️ Client-only | ✅ Persistent | 🟡 P1 |
| Voting | ❌ Missing | ✅ Reddit feature | 🟡 P2 |
| Awards | ❌ Missing | ✅ Reddit feature | 🔵 P3 |
| Trending | ❌ Missing | ✅ Instagram feature | 🔵 P3 |

---

### ✅ **Conclusion**

Your current schema is a **solid foundation** but missing critical social features:

1. **Immediate Needs:**
   - Comments system
   - Notifications
   - Follows/social graph
   - Persistent saved posts

2. **Your Posts Schema is Good:**
   - Proper engagement tracking
   - Denormalized for performance
   - Good use of arrays (likedBy)

3. **Next Steps:**
   - Implement notification types
   - Create notification service
   - Add Cloud Functions for real-time notifications
   - Add comments collection
   - Implement follows system
