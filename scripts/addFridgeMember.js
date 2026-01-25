const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://campusmealsv2-bd20b-default-rtdb.firebaseio.com"
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function addMember() {
  try {
    const fridgeId = 'dMw3fTlIvIpnXkqe1W4o'; // Kek fridge
    const newMemberEmail = 'sarp.akar@gmail.com';

    // Get the user record
    const userRecord = await auth.getUserByEmail(newMemberEmail);

    console.log(`Adding ${newMemberEmail} (UID: ${userRecord.uid}) as member to fridge...`);

    // Add member to the fridge
    const memberRef = db.collection('fridges').doc(fridgeId).collection('members').doc(userRecord.uid);

    await memberRef.set({
      userId: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || 'Sarp',
      photoURL: userRecord.photoURL || null,
      role: 'member', // owner or member
      joinedAt: admin.firestore.Timestamp.now(),
    });

    console.log('✓ Successfully added member!');
    console.log('\nMember details:');
    console.log('  Email:', userRecord.email);
    console.log('  UID:', userRecord.uid);
    console.log('  Display Name:', userRecord.displayName);
    console.log('  Role: member');

  } catch (error) {
    console.error('Error adding member:', error);
  } finally {
    process.exit(0);
  }
}

addMember();
