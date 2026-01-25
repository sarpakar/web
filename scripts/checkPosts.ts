// Script to check Firestore posts collection structure
import * as admin from 'firebase-admin';
import * as path from 'path';

// Initialize Firebase Admin with service account
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'campusmealsv2-bd20b'
});

const db = admin.firestore();

async function checkPosts() {
  try {
    console.log('🔍 Checking posts collection...\n');

    // Get first 5 posts
    const postsSnapshot = await db.collection('posts')
      .limit(5)
      .get();

    if (postsSnapshot.empty) {
      console.log('❌ No posts found in collection');
      return;
    }

    console.log(`✅ Found ${postsSnapshot.size} posts\n`);

    postsSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`--- Post ${index + 1} (ID: ${doc.id}) ---`);
      console.log('Fields:', Object.keys(data));
      console.log('Caption:', data.caption || 'N/A');
      console.log('Restaurant:', data.restaurantName || 'N/A');
      console.log('Tags:', data.tags || []);
      console.log('Has embedding:', !!data.embedding_field);
      console.log('');
    });

    // Count total posts
    const allPosts = await db.collection('posts').count().get();
    console.log(`📊 Total posts in collection: ${allPosts.data().count}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await admin.app().delete();
  }
}

checkPosts();
