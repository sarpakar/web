import { NextRequest, NextResponse } from 'next/server';

/**
 * POST - Create session cookie after Firebase sign-in
 * This enables server-side route protection via middleware
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // Create response with session cookie
    const response = NextResponse.json({ success: true });

    // Set a session cookie that middleware can check
    // Note: For production, you should verify the token with Firebase Admin SDK
    response.cookies.set('__session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Clear session cookie on sign-out
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  // Clear the session cookie
  response.cookies.set('__session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Immediately expire
    path: '/',
  });

  return response;
}
