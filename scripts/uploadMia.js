// Script to upload Mia user and post to Firebase
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

const mia = {
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
};

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

async function uploadMia() {
  console.log('🌱 Uploading Mia...\n');

  const profileImagePath = path.join(__dirname, '../public/people', mia.profileImage);
  const postImagePath = path.join(__dirname, '../public/postsuplaod', mia.postImage);

  if (!fs.existsSync(profileImagePath)) {
    console.error(`❌ Profile image not found: ${profileImagePath}`);
    return;
  }

  if (!fs.existsSync(postImagePath)) {
    console.error(`❌ Post image not found: ${postImagePath}`);
    return;
  }

  try {
    const timestamp = Date.now();
    const profileToken = `profile-${mia.id}-${timestamp}`;
    const postToken = `post-${mia.id}-${timestamp}`;

    // Upload profile image
    const profileExt = path.extname(mia.profileImage);
    const profileStoragePath = `users/${mia.id}/profile${profileExt}`;
    const profileURL = await uploadImage(profileImagePath, profileStoragePath, profileToken);

    // Create user document
    console.log(`  📝 Creating user document...`);
    await db.collection('users').doc(mia.id).set({
      id: mia.id,
      name: mia.name,
      displayName: mia.displayName,
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
    console.log(`  ✅ User created: ${mia.id}`);

    // Upload post image
    const postExt = path.extname(mia.postImage);
    const postStoragePath = `media/${mia.id}/posts/${timestamp}${postExt}`;
    const postImageURL = await uploadImage(postImagePath, postStoragePath, postToken);

    // Create post document
    console.log(`  📝 Creating post document...`);
    const postData = {
      userId: mia.id,
      userName: mia.name,
      userAvatarURL: profileURL,
      title: mia.title,
      caption: mia.postCaption,
      primaryFeedURL: postImageURL,
      primaryImageURL: postImageURL,
      primaryThumbnailURL: postImageURL,
      primaryOriginalURL: postImageURL,
      mealType: mia.mealType,
      venueName: mia.venueName,
      calories: mia.calories,
      protein: mia.protein,
      carbs: mia.carbs,
      fat: mia.fat,
      time: mia.time,
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
      tags: mia.tags,
      status: 'ready',
      date: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      searchable_text: `${mia.title} ${mia.postCaption} ${mia.venueName} ${mia.mealType}`
    };

    const docRef = await db.collection('posts').add(postData);
    console.log(`  ✅ Post created: ${docRef.id}`);

    console.log('\n🎉 Mia uploaded successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

uploadMia()
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
