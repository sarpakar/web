---
name: post-upload
description: Upload demo users and posts to Firebase. Creates users with profile images and posts with food images. Use this to seed the feed with sample content.
allowed-tools: Read, Write, Bash, Glob, mcp__firebase__firestore_get_documents, mcp__firebase__firestore_delete_document
---

# Post Upload Skill for Campus Meals

Upload demo users and posts to Firebase Storage and Firestore.

## Usage

```
/post-upload <user-name> <profile-image-path> <post-image-path> "<caption>"
```

Or for multiple users:
```
/post-upload --batch
```

## Arguments

- `$ARGUMENTS` - Can be:
  - `<name> <profile-image> <post-image> "<caption>"` - Single user
  - `--batch` - Run the full batch seed script

## Script Location

The seed script is located at: `scripts/seedDemoUsers.js`

## How It Works

### 1. Image Upload to Firebase Storage

Images are uploaded using Firebase Admin SDK:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'campusmealsv2-bd20b.firebasestorage.app'
});

const bucket = admin.storage().bucket();

// Upload image
await bucket.upload(localPath, {
  destination: storagePath,
  metadata: {
    contentType: 'image/jpeg', // or 'image/png'
    metadata: {
      firebaseStorageDownloadTokens: uniqueToken
    }
  }
});

// Generate URL
const url = `https://firebasestorage.googleapis.com/v0/b/campusmealsv2-bd20b.firebasestorage.app/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
```

### 2. Storage Paths

- **Profile images**: `users/{userId}/profile.jpg`
- **Post images**: `media/{userId}/posts/{timestamp}.jpg`

### 3. User Document Structure

Create in `users` collection with document ID = userId:

```javascript
{
  id: string,              // Same as document ID
  name: string,
  displayName: string,
  photoURL: string,        // Firebase Storage URL
  photo_url: string,       // Duplicate for compatibility
  totalXP: 0,
  level: 1,
  hasCompletedOnboarding: true,
  notificationsEnabled: true,
  friends: [],             // Array of friend user IDs
  createdAt: serverTimestamp(),
  lastActive: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

### 4. Post Document Structure

Create in `posts` collection (auto-generated ID):

```javascript
{
  // User info
  userId: string,
  userName: string,
  userAvatarURL: string,

  // Content
  title: string,           // e.g., "L'industrie Pizza"
  caption: string,         // e.g., "Best pizza in Brooklyn!"

  // Media URLs (all same URL for now)
  primaryFeedURL: string,
  primaryImageURL: string,
  primaryThumbnailURL: string,
  primaryOriginalURL: string,

  // Metadata
  mealType: string,        // "Breakfast", "Lunch", "Dinner", "Snack"
  venueName: string,       // Restaurant name
  time: string,            // "9:00 AM"

  // Nutrition (optional)
  calories: number,
  protein: number,
  carbs: number,
  fat: number,

  // Engagement
  isPublic: true,
  likedBy: [],
  likeCount: 0,
  commentCount: 0,
  shareCount: 0,
  saveCount: 0,
  mediaCount: 1,
  mediaIds: [],
  engagement: {
    likes: 0,
    views: 0,
    comments: 0,
    shares: 0,
    score: 0
  },

  // Status
  status: 'ready',
  tags: [],

  // Timestamps
  date: serverTimestamp(),
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),

  // Search
  searchable_text: string  // Concatenated searchable fields
}
```

## Image Directories

- **Profile images**: `public/people/`
- **Post images**: `public/postsuplaod/`

## Running the Batch Seed

To run the existing batch seed:

```bash
node scripts/seedDemoUsers.js
```

This creates:
- 3 users: Emma, Liam, Noah
- 2 posts with food images (L'industrie Pizza, Apollo Bagels)

## Adding Friendships

To make users friends with an existing user (e.g., Berkin):

```bash
node scripts/addFriendships.js
```

## Creating a Single Post

To create a single new user and post, create a script like:

```javascript
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'campusmealsv2-bd20b',
  storageBucket: 'campusmealsv2-bd20b.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function uploadPost(userName, profileImagePath, postImagePath, caption, options = {}) {
  const userId = `demo-${userName.toLowerCase()}-${Date.now()}`;
  const timestamp = Date.now();

  // Upload profile image
  const profileToken = `profile-${userId}`;
  await bucket.upload(profileImagePath, {
    destination: `users/${userId}/profile.jpg`,
    metadata: {
      contentType: 'image/jpeg',
      metadata: { firebaseStorageDownloadTokens: profileToken }
    }
  });
  const profileURL = `https://firebasestorage.googleapis.com/v0/b/campusmealsv2-bd20b.firebasestorage.app/o/${encodeURIComponent(`users/${userId}/profile.jpg`)}?alt=media&token=${profileToken}`;

  // Upload post image
  const postToken = `post-${userId}-${timestamp}`;
  await bucket.upload(postImagePath, {
    destination: `media/${userId}/posts/${timestamp}.jpg`,
    metadata: {
      contentType: 'image/jpeg',
      metadata: { firebaseStorageDownloadTokens: postToken }
    }
  });
  const postImageURL = `https://firebasestorage.googleapis.com/v0/b/campusmealsv2-bd20b.firebasestorage.app/o/${encodeURIComponent(`media/${userId}/posts/${timestamp}.jpg`)}?alt=media&token=${postToken}`;

  // Create user
  await db.collection('users').doc(userId).set({
    id: userId,
    name: userName,
    displayName: userName,
    photoURL: profileURL,
    photo_url: profileURL,
    totalXP: 0,
    level: 1,
    hasCompletedOnboarding: true,
    friends: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastActive: admin.firestore.FieldValue.serverTimestamp()
  });

  // Create post
  await db.collection('posts').add({
    userId,
    userName,
    userAvatarURL: profileURL,
    title: options.title || caption.split(' ').slice(0, 3).join(' '),
    caption,
    primaryFeedURL: postImageURL,
    primaryImageURL: postImageURL,
    primaryThumbnailURL: postImageURL,
    primaryOriginalURL: postImageURL,
    mealType: options.mealType || 'Lunch',
    venueName: options.venueName || '',
    calories: options.calories || 0,
    protein: options.protein || 0,
    carbs: options.carbs || 0,
    fat: options.fat || 0,
    time: options.time || '12:00 PM',
    isPublic: true,
    likedBy: [],
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    saveCount: 0,
    mediaCount: 1,
    mediaIds: [],
    engagement: { likes: 0, views: 0, comments: 0, shares: 0, score: 0 },
    status: 'ready',
    tags: options.tags || [],
    date: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    searchable_text: `${options.title || ''} ${caption} ${options.venueName || ''}`
  });

  console.log(`✅ Created user ${userName} and post!`);
}

// Example usage:
uploadPost(
  'Alex',
  './public/people/alex.jpg',
  './public/postsuplaod/food.jpg',
  'Amazing brunch spot! 🥞',
  {
    title: 'Pancake Stack',
    mealType: 'Breakfast',
    venueName: 'The Pancake House',
    calories: 650,
    protein: 12,
    carbs: 85,
    fat: 28,
    tags: ['brunch', 'pancakes', 'breakfast']
  }
).then(() => process.exit(0));
```

## Troubleshooting

### Posts not showing in feed?
1. Ensure `isPublic: true` is set
2. Check that `date` field is a valid Timestamp
3. Hard refresh the browser (Cmd+Shift+R)
4. Check browser console for errors

### Image not loading?
1. Verify the token matches in URL
2. Check Firebase Storage rules allow public read
3. Try the URL directly in browser
