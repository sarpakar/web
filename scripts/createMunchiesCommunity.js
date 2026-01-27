// Script to create Munchies community with image upload to Firebase Storage
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
const bucket = admin.storage().bucket();

async function createMunchiesCommunity() {
  try {
    console.log('🍔 Creating Munchies community...\n');

    // 1. Upload image to Firebase Storage
    const imagePath = path.join(__dirname, '../public/communities/munchies.png');
    const destinationPath = 'communities/munchies-thumbnail.png';

    console.log('📤 Uploading image to Firebase Storage...');

    await bucket.upload(imagePath, {
      destination: destinationPath,
      metadata: {
        contentType: 'image/png',
        metadata: {
          firebaseStorageDownloadTokens: 'munchies-token'
        }
      }
    });

    // Get the public URL
    const imageURL = `https://firebasestorage.googleapis.com/v0/b/campusmealsv2-bd20b.firebasestorage.app/o/${encodeURIComponent(destinationPath)}?alt=media&token=munchies-token`;

    console.log('✅ Image uploaded successfully!');
    console.log('📎 URL:', imageURL);

    // 2. Create Firestore community document
    console.log('\n📝 Creating Firestore community document...');

    const communityData = {
      name: 'Munchies',
      description: 'For late-night snack lovers and comfort food enthusiasts. Share your favorite munchies, fast food finds, and guilty pleasures!',
      type: 'lifestyle',
      imageURL: imageURL,
      bannerURL: imageURL,
      creatorId: 'system',
      creatorName: 'Campus Meals',
      memberCount: 0,
      memberAvatars: [],
      isPrivate: false,
      isVerified: true,
      rules: [
        'Share your favorite munchies and snacks',
        'Be respectful of dietary choices',
        'No spam or self-promotion',
        'Tag your posts with relevant categories'
      ],
      tags: ['snacks', 'fast-food', 'comfort-food', 'late-night', 'munchies'],
      postsCount: 0,
      challengesCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastActivityAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('communities').add(communityData);

    console.log('✅ Community created successfully!');
    console.log('📄 Document ID:', docRef.id);
    console.log('\n🎉 Munchies community is ready!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await admin.app().delete();
  }
}

createMunchiesCommunity();
