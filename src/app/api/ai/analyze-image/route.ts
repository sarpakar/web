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

    const body = await request.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return NextResponse.json({ error: 'API not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: 'What food do you see in this image? Describe it briefly in 2-3 sentences.' },
              { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
            ]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image analysis API error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not analyze image';

    return NextResponse.json({ analysis: analysisText });

  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
