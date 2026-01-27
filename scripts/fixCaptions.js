// Script to fix caption - remove emojis
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'campusmealsv2-bd20b',
});

const db = admin.firestore();

const updates = [
  {
    postId: 'ijQtJn8pdJ7z3KeS98HR',
    caption: 'Had pizza and then played tennis, perfect day 🍕🎾'
  },
  {
    postId: '4UgFuBaPxRHqRfiR4oMj',
    caption: 'Parents visited, best place to take them 🍔'
  },
  {
    postId: 'G335Ggd5IvUf4TAl9dcV',
    caption: 'Definitely worth the wait 🥯'
  }
];

async function fixCaptions() {
  console.log('📝 Fixing captions...\n');

  for (const update of updates) {
    console.log(`Updating ${update.postId}...`);
    await db.collection('posts').doc(update.postId).update({
      caption: update.caption,
      searchable_text: update.caption
    });
    console.log(`✅ Updated: "${update.caption}"`);
  }

  console.log('\n🎉 Done!');
}

fixCaptions()
  .then(async () => {
    await admin.app().delete();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('❌ Error:', error);
    await admin.app().delete();
    process.exit(1);
  });
