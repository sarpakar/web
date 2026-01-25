const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://campusmealsv2-bd20b-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

async function fetchFridgeComponents() {
  try {
    console.log('Fetching fridge components...\n');

    const fridgesSnapshot = await db.collection('fridges').get();

    if (fridgesSnapshot.empty) {
      console.log('No fridges found in the database.');
      return;
    }

    console.log(`Found ${fridgesSnapshot.size} fridge(s)\n`);

    const allFridges = [];

    for (const fridgeDoc of fridgesSnapshot.docs) {
      const fridgeData = fridgeDoc.data();
      console.log(`\n=== Fridge: ${fridgeDoc.id} ===`);
      console.log('Fridge Data:', JSON.stringify(fridgeData, null, 2));

      // Check for subcollections (items/components)
      const itemsSnapshot = await fridgeDoc.ref.collection('items').get();
      if (!itemsSnapshot.empty) {
        console.log(`\n  Items in this fridge (${itemsSnapshot.size}):`);
        itemsSnapshot.forEach(item => {
          console.log(`    - ${item.id}:`, JSON.stringify(item.data(), null, 2));
        });
      }

      // Check for members subcollection
      const membersSnapshot = await fridgeDoc.ref.collection('members').get();
      if (!membersSnapshot.empty) {
        console.log(`\n  Members in this fridge (${membersSnapshot.size}):`);
        membersSnapshot.forEach(member => {
          console.log(`    - ${member.id}:`, JSON.stringify(member.data(), null, 2));
        });
      }

      allFridges.push({
        id: fridgeDoc.id,
        ...fridgeData,
        items: itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        members: membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      });
    }

    // Save to JSON file for reference
    const fs = require('fs');
    fs.writeFileSync(
      'fridge-data.json',
      JSON.stringify(allFridges, null, 2)
    );
    console.log('\n\n✓ Saved all fridge data to fridge-data.json');

  } catch (error) {
    console.error('Error fetching fridge components:', error);
  } finally {
    process.exit(0);
  }
}

fetchFridgeComponents();
