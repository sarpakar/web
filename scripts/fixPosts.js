// Script to add missing primaryOriginalURL field to posts
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

// Posts to fix
const postsToFix = [
  'btWzWneq40tDlbq3bZO8',
  'm3cHzdFzbwUlkCiMXX49'
];

async function fixPosts() {
  console.log('🔧 Fixing posts...\n');

  for (const postId of postsToFix) {
    console.log(`Fixing post: ${postId}...`);

    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      console.log(`  ⚠️ Post not found: ${postId}`);
      continue;
    }

    const data = postDoc.data();

    // Add primaryOriginalURL (same as primaryImageURL)
    await postRef.update({
      primaryOriginalURL: data.primaryImageURL
    });

    console.log(`✅ Fixed: ${postId}`);
  }

  console.log('\n🎉 All posts fixed!');
}

// Run
fixPosts()
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
