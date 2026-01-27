// Script to delete and re-upload posts in correct order: Mia, Liam, Emma, Noah
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'campusmealsv2-bd20b',
  storageBucket: 'campusmealsv2-bd20b.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

// Order: Noah (newest), Emma, Liam, Mia (oldest)
const demoUsers = [
  {
    id: 'demo-mia-004',
    name: 'Mia',
    displayName: 'Mia',
    profileImage: '816230758da3649866b5f4f7c6110456.jpg',
    postImage: 'subway friends.jpg',
    postCaption: "Late night subway rides with the bestie 🚇✨",
    title: 'NYC Subway Adventures',
    mealType: 'Snack',
    venueName: 'NYC Subway',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    time: '11:30 PM',
    tags: ['nyc', 'subway', 'friends', 'nightlife', 'city']
  },
  {
    id: 'demo-liam-002',
    name: 'Liam',
    displayName: 'Liam',
    profileImage: '569b3d16006db1361d8940a524993c52.jpg',
    postImage: 'Red Hook Tavern.jpg',
    postCaption: "Parents visited, best place to take them 🍔",
    title: 'Red Hook Tavern Burger',
    mealType: 'Dinner',
    venueName: 'Red Hook Tavern',
    calories: 850,
    protein: 42,
    carbs: 48,
    fat: 52,
    time: '7:30 PM',
    tags: ['burger', 'redhook', 'brooklyn', 'tavern', 'dinner']
  },
  {
    id: 'demo-emma-001',
    name: 'Emma',
    displayName: 'Emma',
    profileImage: '269ea14ae1b312e9d73cc8a1acb868aa.jpg',
    postImage: 'Lindustrie Pizza.jpg',
    postCaption: "Had pizza and then played tennis, perfect day 🍕🎾",
    title: "L'industrie Pizza",
    mealType: 'Lunch',
    venueName: "L'industrie Pizzeria",
    calories: 680,
    protein: 24,
    carbs: 72,
    fat: 32,
    time: '1:30 PM',
    tags: ['pizza', 'brooklyn', 'lindustrie', 'foodie', 'nyc']
  },
  {
    id: 'demo-noah-003',
    name: 'Noah',
    displayName: 'Noah',
    profileImage: '10116edf1a14e1fac1d250f09c3f901d.jpg',
    postImage: 'apollo bagel.jpg',
    postCaption: "Definitely worth the wait 🥯",
    title: 'Apollo Bagels',
    mealType: 'Breakfast',
    venueName: 'Apollo Bagels',
    calories: 520,
    protein: 28,
    carbs: 48,
    fat: 22,
    time: '9:15 AM',
    tags: ['bagels', 'apollo', 'breakfast', 'lox', 'nyc']
  }
];

async function deleteExistingPosts() {
  console.log('🗑️  Deleting existing demo posts...');

  const userIds = ['demo-emma-001', 'demo-liam-002', 'demo-noah-003', 'demo-mia-004'];

  for (const userId of userIds) {
    const posts = await db.collection('posts').where('userId', '==', userId).get();
    for (const doc of posts.docs) {
      await doc.ref.delete();
      console.log(`  Deleted post: ${doc.id}`);
    }
  }

  console.log('✅ All demo posts deleted\n');
}

async function uploadImage(localPath, storagePath, token) {
  console.log(`  📤 Uploading to ${storagePath}...`);
  const contentType = getContentType(localPath);

  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: contentType,
      metadata: {
        firebaseStorageDownloadTokens: token
      }
    }
  });

  const url = `https://firebasestorage.googleapis.com/v0/b/campusmealsv2-bd20b.firebasestorage.app/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
  console.log(`  ✅ Uploaded!`);
  return url;
}

async function reorderPosts() {
  console.log('🌱 Re-uploading posts in order: Noah, Emma, Liam, Mia\n');

  // First delete all existing posts
  await deleteExistingPosts();

  // Upload in reverse order (oldest first) so newest appears at top
  // Order: Noah (oldest), Emma, Liam, Mia (newest)
  for (let i = 0; i < demoUsers.length; i++) {
    const user = demoUsers[i];
    console.log(`\n👤 Processing ${user.name}...`);

    const profileImagePath = path.join(__dirname, '../public/people', user.profileImage);
    const postImagePath = path.join(__dirname, '../public/postsuplaod', user.postImage);

    if (!fs.existsSync(profileImagePath)) {
      console.error(`  ❌ Profile image not found: ${profileImagePath}`);
      continue;
    }

    if (!fs.existsSync(postImagePath)) {
      console.error(`  ❌ Post image not found: ${postImagePath}`);
      continue;
    }

    try {
      const timestamp = Date.now();
      const profileToken = `profile-${user.id}-${timestamp}`;
      const postToken = `post-${user.id}-${timestamp}`;

      // Upload profile image
      const profileExt = path.extname(user.profileImage);
      const profileStoragePath = `users/${user.id}/profile${profileExt}`;
      const profileURL = await uploadImage(profileImagePath, profileStoragePath, profileToken);

      // Update user document
      console.log(`  📝 Updating user document...`);
      await db.collection('users').doc(user.id).set({
        id: user.id,
        name: user.name,
        displayName: user.displayName,
        photoURL: profileURL,
        photo_url: profileURL,
        totalXP: 0,
        level: 1,
        hasCompletedOnboarding: true,
        notificationsEnabled: true,
        friends: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastActive: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`  ✅ User updated: ${user.id}`);

      // Upload post image
      const postExt = path.extname(user.postImage);
      const postStoragePath = `media/${user.id}/posts/${timestamp}${postExt}`;
      const postImageURL = await uploadImage(postImagePath, postStoragePath, postToken);

      // Create post document
      console.log(`  📝 Creating post document...`);
      const postData = {
        userId: user.id,
        userName: user.name,
        userAvatarURL: profileURL,
        title: user.title,
        caption: user.postCaption,
        primaryFeedURL: postImageURL,
        primaryImageURL: postImageURL,
        primaryThumbnailURL: postImageURL,
        primaryOriginalURL: postImageURL,
        mealType: user.mealType,
        venueName: user.venueName,
        calories: user.calories,
        protein: user.protein,
        carbs: user.carbs,
        fat: user.fat,
        time: user.time,
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
        tags: user.tags,
        status: 'ready',
        date: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        searchable_text: `${user.title} ${user.postCaption} ${user.venueName} ${user.mealType}`
      };

      const docRef = await db.collection('posts').add(postData);
      console.log(`  ✅ Post created: ${docRef.id}`);
      console.log(`  🎉 ${user.name} completed!`);

      // Wait 1 second between posts to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ❌ Error processing ${user.name}:`, error);
    }
  }

  console.log('\n\n✅ All posts re-uploaded in correct order!');
  console.log('📋 Feed order (newest to oldest):');
  console.log('   1. Noah - Apollo Bagels');
  console.log('   2. Emma - L\'industrie Pizza');
  console.log('   3. Liam - Red Hook Tavern');
  console.log('   4. Mia - NYC Subway Adventures');
}

reorderPosts()
  .then(async () => {
    console.log('\n👋 Done!');
    await admin.app().delete();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('❌ Fatal error:', error);
    await admin.app().delete();
    process.exit(1);
  });
