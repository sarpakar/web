// Script to upload Emma, Liam, and Noah to Firebase
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin with service account
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

const demoUsers = [
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
  console.log(`  ✅ Uploaded! (${contentType})`);
  return url;
}

async function uploadUsers() {
  console.log('🌱 Uploading Emma, Liam, and Noah...\n');

  for (const user of demoUsers) {
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

      // Create user document
      console.log(`  📝 Creating user document...`);
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
      });
      console.log(`  ✅ User created: ${user.id}`);

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
        searchable_text: `${user.title} ${user.postCaption} ${user.venueName} ${user.mealType} ${user.protein}g protein ${user.calories} calories`
      };

      const docRef = await db.collection('posts').add(postData);
      console.log(`  ✅ Post created: ${docRef.id}`);
      console.log(`  🎉 ${user.name} completed!`);

    } catch (error) {
      console.error(`  ❌ Error processing ${user.name}:`, error);
    }
  }

  console.log('\n\n✅ All users uploaded!');
  console.log('📋 Created:');
  console.log('   - Emma: L\'industrie Pizza');
  console.log('   - Liam: Red Hook Tavern');
  console.log('   - Noah: Apollo Bagels');
}

uploadUsers()
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
