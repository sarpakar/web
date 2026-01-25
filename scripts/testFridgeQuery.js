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

async function testQuery() {
  try {
    const userId = '7ebBFn039cNE0Typ0nMcVP652UP2'; // sarp.akar@gmail.com
    const fridgeId = 'dMw3fTlIvIpnXkqe1W4o';

    console.log('Testing fridge query for user:', userId);
    console.log('Fridge ID:', fridgeId);
    console.log('');

    // Test 1: Check if fridge exists
    const fridgeDoc = await db.collection('fridges').doc(fridgeId).get();
    if (fridgeDoc.exists) {
      console.log('✅ Fridge exists');
      console.log('   Name:', fridgeDoc.data().name);
      console.log('   Owner ID:', fridgeDoc.data().ownerId);
    } else {
      console.log('❌ Fridge does not exist');
      return;
    }

    // Test 2: Check members collection
    console.log('\n📋 Checking members...');
    const membersSnapshot = await db.collection('fridges').doc(fridgeId).collection('members').get();
    console.log('   Total members:', membersSnapshot.size);
    membersSnapshot.forEach(doc => {
      console.log(`   - ${doc.id}: ${doc.data().email} (${doc.data().role})`);
    });

    // Test 3: Query for specific member
    console.log('\n🔍 Querying for user membership...');
    const memberQuery = await db.collection('fridges')
      .doc(fridgeId)
      .collection('members')
      .where('userId', '==', userId)
      .get();

    if (memberQuery.empty) {
      console.log('❌ User is NOT a member (query returned empty)');
    } else {
      console.log('✅ User IS a member');
      memberQuery.forEach(doc => {
        console.log('   Member data:', doc.data());
      });
    }

    // Test 4: Direct document check
    console.log('\n📄 Direct member document check...');
    const memberDoc = await db.collection('fridges')
      .doc(fridgeId)
      .collection('members')
      .doc(userId)
      .get();

    if (memberDoc.exists) {
      console.log('✅ Member document exists');
      console.log('   Data:', memberDoc.data());
    } else {
      console.log('❌ Member document does not exist');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

testQuery();
