import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json();

    if (!email || !plan) {
      return NextResponse.json({ error: 'Email and plan are required' }, { status: 400 });
    }

    const updatedUser = await updateUser(email, { plan });
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        email: updatedUser.email,
        plan: updatedUser.plan,
        docsUsed: updatedUser.docsUsed,
        bonusDocs: updatedUser.bonusDocs,
      },
    });
  } catch (error: any) {
    console.error('Subscription verify API error:', error);
    return NextResponse.json(
      { error: 'Verification failed: ' + (error?.message || error) },
      { status: 500 }
    );
  }
}
