const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin (reuse existing app if already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://campusmealsv2-bd20b-default-rtdb.firebaseio.com"
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function checkUser() {
  try {
    // Check for user with email sarp.akar@gmail.com
    console.log('\n=== Checking for user with email: sarp.akar@gmail.com ===\n');

    try {
      const userRecord = await auth.getUserByEmail('sarp.akar@gmail.com');
      console.log('Found user in Firebase Auth:');
      console.log('  UID:', userRecord.uid);
      console.log('  Email:', userRecord.email);
      console.log('  Display Name:', userRecord.displayName);
      console.log('  Photo URL:', userRecord.photoURL);

      // Check if this user has a Firestore profile
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      if (userDoc.exists()) {
        console.log('\n  Firestore profile:', JSON.stringify(userDoc.data(), null, 2));
      } else {
        console.log('\n  No Firestore profile found');
      }

      // Check if this user is a member of any fridges
      const fridgesSnapshot = await db.collection('fridges').get();
      console.log('\n  Checking fridge memberships...');

      for (const fridgeDoc of fridgesSnapshot.docs) {
        const memberDoc = await db.collection('fridges').doc(fridgeDoc.id).collection('members').doc(userRecord.uid).get();
        if (memberDoc.exists()) {
          console.log(`    ✓ Member of fridge: ${fridgeDoc.data().name} (${fridgeDoc.id})`);
        }
      }
    } catch (error) {
      console.log('User not found with email sarp.akar@gmail.com');
      console.log('Error:', error.message);
    }

    // Also check for the other email
    console.log('\n\n=== Checking for user with email: akarsarp0@gmail.com ===\n');

    try {
      const userRecord2 = await auth.getUserByEmail('akarsarp0@gmail.com');
      console.log('Found user in Firebase Auth:');
      console.log('  UID:', userRecord2.uid);
      console.log('  Email:', userRecord2.email);
      console.log('  Display Name:', userRecord2.displayName);
    } catch (error) {
      console.log('User not found with email akarsarp0@gmail.com');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkUser();
