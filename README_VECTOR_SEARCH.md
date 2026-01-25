# Vector Search Setup for Campus Meals

This guide explains how to set up Firestore Vector Search with Gemini embeddings for semantic search across meal posts.

## Prerequisites

1. **Get a new Gemini API Key** (your previous key was leaked and disabled)
   - Visit: https://aistudio.google.com/app/apikey
   - Create a new API key
   - **Important**: Do NOT share this key publicly

2. **Set up environment variables**
   ```bash
   # Create .env.local file
   cp .env.example .env.local

   # Add your Gemini API key to .env.local
   NEXT_PUBLIC_GEMINI_API_KEY=your_new_api_key_here
   ```

## Step 1: Generate Embeddings for Posts

Run the embedding generation script to create vector embeddings for all existing posts:

```bash
# Set your API key for the script
export GEMINI_API_KEY=your_new_api_key_here

# Run the script
npm run generate-embeddings
# or
npx tsx scripts/generateEmbeddings.ts
```

This script will:
- Fetch all posts from Firestore
- Generate 768-dimension embeddings using Gemini's `text-embedding-004` model
- Store embeddings in the `embedding_field` field
- Skip posts that already have embeddings

## Step 2: Create Firestore Vector Index

After generating embeddings, create a vector index in Firestore using gcloud CLI:

```bash
gcloud alpha firestore indexes composite create \
  --collection-group=posts \
  --query-scope=COLLECTION \
  --field-config field-path=embedding_field,vector-config='{"dimension":"768", "flat": "{}"}' \
  --project=campusmealsv2-bd20b
```

**Note**: Index creation can take several minutes to hours depending on the number of documents.

Check index status:
```bash
gcloud firestore indexes composite list --project=campusmealsv2-bd20b
```

Or check in Firebase Console:
https://console.firebase.google.com/project/campusmealsv2-bd20b/firestore/indexes

## Step 3: Use Vector Search in Your App

Once the index is ready, the search will automatically use vector similarity:

### Search Interface
- Open the search tab in your app
- Type a query like "high protein meals" or "sushi"
- The app will:
  1. Generate an embedding for your query
  2. Perform vector similarity search in Firestore
  3. Return relevant posts with AI-powered summaries

### Fallback Behavior
Until the vector index is built, the app uses traditional text matching as a fallback.

## How It Works

### 1. **Embedding Generation**
When a post is created or updated:
```typescript
const searchableText = `${title} ${caption} ${venueName} ${mealType}`;
const embedding = await generateEmbedding(searchableText);
```

### 2. **Vector Search**
When a user searches:
```typescript
const queryEmbedding = await generateEmbedding(searchQuery);
const results = await db.collection('posts')
  .findNearest('embedding_field', FieldValue.vector(queryEmbedding), {
    limit: 10,
    distanceMeasure: 'EUCLIDEAN'
  });
```

### 3. **AI Summary**
Gemini generates a contextual summary for the search results to help users understand what they're looking at.

## Files Created

- `src/services/vectorSearchService.ts` - Vector search implementation
- `scripts/generateEmbeddings.ts` - Batch embedding generation
- `scripts/checkPosts.ts` - Utility to inspect posts collection
- `.env.example` - Environment variable template

## Troubleshooting

### API Key Issues
If you see "API key was reported as leaked":
1. Get a new API key from https://aistudio.google.com/app/apikey
2. Update your `.env.local` file
3. Never commit API keys to git

### No Search Results
1. Check that embeddings were generated: `npx tsx scripts/checkPosts.ts`
2. Verify the vector index is built in Firebase Console
3. Check browser console for errors

### Rate Limiting
The embedding generation script includes 100ms delays between requests to avoid rate limits. For large datasets, consider batching.

## Monitoring

Check Firestore usage:
```bash
# View collection stats
npx tsx scripts/checkPosts.ts
```

## Cost Considerations

- **Gemini Embeddings**: Free tier includes 1,500 requests/day
- **Firestore Vector Search**: Charged per index entry read
- See: https://firebase.google.com/docs/firestore/pricing

## Next Steps

1. ✅ Set up automatic embedding generation for new posts
2. ✅ Add pre-filtering by meal type or restaurant
3. ✅ Implement caching for common queries
4. ✅ Add analytics to track search patterns

## Resources

- [Firestore Vector Search Docs](https://firebase.google.com/docs/firestore/vector-search)
- [Gemini Embeddings API](https://ai.google.dev/tutorials/embeddings_quickstart)
- [Google Cloud Blog Post](https://cloud.google.com/blog/products/databases/build-ai-powered-apps-with-firestore-vector-search)
