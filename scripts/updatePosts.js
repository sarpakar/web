// Script to update posts to match exact structure of working posts
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin with service account
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'campusmealsv2-bd20b',
  storageBucket: 'campusmealsv2-bd20b.firebasestorage.app'
});

const db = admin.firestore();

// Post IDs to update
const postsToUpdate = [
  {
    postId: 'btWzWneq40tDlbq3bZO8',
    title: "L'industrie Pizza",
    mealType: 'Lunch',
    venueName: "L'industrie Pizzeria",
    calories: 680,
    protein: 24,
    carbs: 72,
    fat: 32,
    time: '1:30 PM'
  },
  {
    postId: 'm3cHzdFzbwUlkCiMXX49',
    title: 'Apollo Bagels',
    mealType: 'Breakfast',
    venueName: 'Apollo Bagels',
    calories: 520,
    protein: 28,
    carbs: 48,
    fat: 22,
    time: '9:15 AM'
  }
];

async function updatePosts() {
  console.log('📝 Updating posts to match working structure...\n');

  for (const post of postsToUpdate) {
    console.log(`Updating post: ${post.postId}...`);

    const postRef = db.collection('posts').doc(post.postId);

    await postRef.update({
      title: post.title,
      mealType: post.mealType,
      venueName: post.venueName,
      calories: post.calories,
      protein: post.protein,
      carbs: post.carbs,
      fat: post.fat,
      time: post.time,
      mediaCount: 1,
      mediaIds: [],
      saveCount: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      searchable_text: `${post.title} ${post.mealType} ${post.venueName} ${post.protein}g protein ${post.calories} calories ${post.carbs}g carbs ${post.fat}g fat`
    });

    console.log(`✅ Updated: ${post.title}`);
  }

  console.log('\n🎉 All posts updated!');
}

// Run
updatePosts()
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
