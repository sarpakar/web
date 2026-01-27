// Script to add friendships between Berkin and demo users
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

// User IDs
const BERKIN_ID = 'PbJtNnnTuDc5HwG3dpY1hhC34652';
const DEMO_USER_IDS = [
  'demo-emma-001',
  'demo-liam-002',
  'demo-noah-003'
];

async function addFriendships() {
  console.log('👥 Adding friendships...\n');

  try {
    // 1. Add demo users to Berkin's friends array
    console.log('📝 Adding demo users to Berkin\'s friends list...');
    const berkinRef = db.collection('users').doc(BERKIN_ID);

    await berkinRef.update({
      friends: admin.firestore.FieldValue.arrayUnion(...DEMO_USER_IDS)
    });
    console.log('✅ Added Emma, Liam, Noah to Berkin\'s friends');

    // 2. Add Berkin to each demo user's friends array
    for (const userId of DEMO_USER_IDS) {
      console.log(`📝 Adding Berkin to ${userId}'s friends list...`);
      const userRef = db.collection('users').doc(userId);

      await userRef.update({
        friends: admin.firestore.FieldValue.arrayUnion(BERKIN_ID)
      });
      console.log(`✅ Added Berkin to ${userId}'s friends`);
    }

    console.log('\n🎉 All friendships created successfully!');
    console.log('📋 Berkin is now friends with: Emma, Liam, Noah');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run
addFriendships()
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
