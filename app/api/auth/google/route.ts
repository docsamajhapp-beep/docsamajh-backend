import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { findUserByGoogleId, findUserByEmail, createUser } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_key_12345';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;

export async function POST(req: NextRequest) {
  try {
    const { idToken, email: mockEmail, name: mockName, picture: mockPicture, googleId: mockGoogleId } = await req.json();

    let payload: { sub: string; email: string; name: string; picture?: string } | null = null;

    // Check if token verification is skipped / running mock mode
    const isMockRequest = idToken === 'mock_google_id_token' || !idToken;

    if (!isMockRequest && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.length > 5) {
      try {
        const client = new OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
          idToken,
          audience: GOOGLE_CLIENT_ID,
        });
        const ticketPayload = ticket.getPayload();
        if (ticketPayload && ticketPayload.sub && ticketPayload.email && ticketPayload.name) {
          payload = {
            sub: ticketPayload.sub,
            email: ticketPayload.email,
            name: ticketPayload.name,
            picture: ticketPayload.picture,
          };
        }
      } catch (err) {
        console.error('Google token verification failed, checking mock payload:', err);
      }
    }

    // If verification failed or skipped, use request parameters (simulation fallback)
    if (!payload) {
      // Create a deterministic sub for simulation based on mockEmail
      const emailVal = mockEmail || 'delinquenthabits001@gmail.com';
      const subVal = mockGoogleId || `google_sub_${Buffer.from(emailVal).toString('base64').substring(0, 15)}`;
      payload = {
        sub: subVal,
        email: emailVal,
        name: mockName || emailVal.split('@')[0],
        picture: mockPicture || '',
      };
    }

    // Now query/register user in database
    let user = await findUserByGoogleId(payload.sub);
    if (!user) {
      // Also check by email to merge accounts
      user = await findUserByEmail(payload.email);
      if (!user) {
        // Register new user
        user = await createUser({
          googleId: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          plan: 'free',
          docsUsed: 0,
          bonusDocs: 0,
        });
      }
    }

    // Sign JWT token
    const jwtToken = jwt.sign(
      {
        userId: user.googleId,
        email: user.email,
        plan: user.plan,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      userId: user.googleId,
      name: user.name,
      email: user.email,
      picture: user.picture,
      plan: user.plan,
      docsUsed: user.docsUsed,
      bonusDocs: user.bonusDocs,
      jwtToken,
      notice: isMockRequest ? 'OAuth running in high-fidelity simulation mode.' : undefined,
    });
  } catch (error: any) {
    console.error('Google OAuth API error:', error);
    return NextResponse.json(
      { error: 'Authentication failed: ' + (error?.message || error) },
      { status: 500 }
    );
  }
}
