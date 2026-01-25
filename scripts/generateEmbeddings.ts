// ============================================================================
// Generate Embeddings for Firestore Posts
// Uses Gemini API to generate vector embeddings for semantic search
// ============================================================================

import * as admin from 'firebase-admin';
import * as path from 'path';

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'campusmealsv2-bd20b'
});

const db = admin.firestore();

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const EMBEDDING_MODEL = 'models/text-embedding-004';

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is not set');
  console.log('Please set your Gemini API key:');
  console.log('  export GEMINI_API_KEY=your_api_key_here');
  process.exit(1);
}

interface GeminiEmbeddingResponse {
  embedding: {
    values: number[];
  };
}

/**
 * Generate embedding using Gemini API
 */
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          content: {
            parts: [{ text }]
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data: GeminiEmbeddingResponse = await response.json();
    return data.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Create searchable text from post document
 */
function createSearchableText(post: FirebaseFirestore.DocumentData): string {
  const parts: string[] = [];

  if (post.title) parts.push(post.title);
  if (post.caption) parts.push(post.caption);
  if (post.venueName) parts.push(post.venueName);
  if (post.mealType) parts.push(post.mealType);

  // Add nutritional info
  if (post.protein) parts.push(`${post.protein}g protein`);
  if (post.calories) parts.push(`${post.calories} calories`);
  if (post.carbs) parts.push(`${post.carbs}g carbs`);
  if (post.fat) parts.push(`${post.fat}g fat`);

  return parts.join(' ');
}

/**
 * Main function to generate and store embeddings
 */
async function generateAllEmbeddings() {
  try {
    console.log('🚀 Starting embedding generation...\n');

    // Get all posts
    const postsSnapshot = await db.collection('posts').get();

    if (postsSnapshot.empty) {
      console.log('❌ No posts found');
      return;
    }

    console.log(`📊 Found ${postsSnapshot.size} posts\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const doc of postsSnapshot.docs) {
      try {
        const postData = doc.data();
        const postId = doc.id;

        // Skip if already has embedding
        if (postData.embedding_field) {
          console.log(`⏭️  Skipping ${postId} (already has embedding)`);
          continue;
        }

        // Create searchable text
        const searchableText = createSearchableText(postData);

        if (!searchableText.trim()) {
          console.log(`⚠️  Skipping ${postId} (no searchable content)`);
          continue;
        }

        console.log(`🔄 Generating embedding for: ${postId}`);
        console.log(`   Text: "${searchableText.substring(0, 100)}..."`);

        // Generate embedding
        const embedding = await generateEmbedding(searchableText);

        // Store embedding in Firestore using FieldValue.vector()
        await db.collection('posts').doc(postId).update({
          embedding_field: admin.firestore.FieldValue.vector(embedding),
          searchable_text: searchableText,
          embedding_updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`✅ Successfully generated embedding (dimension: ${embedding.length})\n`);
        successCount++;

        // Rate limiting: wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error processing post ${doc.id}:`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📈 Generation Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📊 Total: ${postsSnapshot.size}`);
    console.log('='.repeat(50) + '\n');

    console.log('💡 Next steps:');
    console.log('1. Create a Firestore vector index using gcloud CLI:');
    console.log('');
    console.log('   gcloud alpha firestore indexes composite create \\');
    console.log('     --collection-group=posts \\');
    console.log('     --query-scope=COLLECTION \\');
    console.log('     --field-config field-path=embedding_field,vector-config=\'{"dimension":"768", "flat": "{}"}\' \\');
    console.log('     --project=campusmealsv2-bd20b');
    console.log('');
    console.log('2. Wait for the index to build (check status in Firebase Console)');
    console.log('3. Use vector search in your app!');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await admin.app().delete();
    console.log('\n✨ Done!');
  }
}

// Run the script
generateAllEmbeddings();
