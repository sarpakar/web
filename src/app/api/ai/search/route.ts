import { NextRequest, NextResponse } from 'next/server';

// Server-side only - NOT prefixed with NEXT_PUBLIC_
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Check for Authorization header (Firebase ID token)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { query, type } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return NextResponse.json({ error: 'API not configured' }, { status: 500 });
    }

    // Handle embedding requests for vector search
    if (type === 'embedding') {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: { parts: [{ text: query }] }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Embedding API error:', response.status, errorText);
        throw new Error(`Embedding API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({ embedding: data.embedding?.values || [] });
    }

    // Handle search/recommendation requests
    const prompt = `You are a helpful food assistant. A user is searching for: "${query}"

Generate a JSON response with food recommendations. Return ONLY valid JSON:
{
  "summary": "A brief, helpful recommendation mentioning specific dishes and venues",
  "recommendations": [
    {
      "id": "1",
      "name": "Dish Name",
      "description": "Brief description",
      "price": 12.99,
      "venueName": "Restaurant Name",
      "category": "Category",
      "isVegetarian": false,
      "isVegan": false,
      "score": 0.95,
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  ]
}

Generate 3-5 realistic food recommendations based on the query. Be creative with venue names and dishes that would match "${query}".`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the JSON response
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      // If JSON parsing fails, return raw response
      return NextResponse.json({
        summary: text,
        recommendations: []
      });
    }

  } catch (error) {
    console.error('AI search error:', error);
    return NextResponse.json(
      { error: 'Failed to process search request' },
      { status: 500 }
    );
  }
}
