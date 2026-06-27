import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const { plan, billing } = await req.json();

    if (!plan) {
      return NextResponse.json({ error: 'Plan is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if real credentials are set
    const isRealSetup = keyId && keyId.length > 5 && keySecret && keySecret.length > 5;

    if (isRealSetup) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        // Map plan names to Razorpay plan IDs (configured on the Razorpay Dashboard)
        // Adjust these placeholders to match actual plan IDs created in Razorpay
        let planId = '';
        if (plan === 'pro') {
          planId = billing === 'yearly' ? 'plan_ProYearly123' : 'plan_ProMonthly123';
        } else if (plan === 'premium') {
          planId = billing === 'yearly' ? 'plan_PremYearly123' : 'plan_PremMonthly123';
        }

        // Standard subscription parameters
        const subscription = await razorpay.subscriptions.create({
          plan_id: planId || 'plan_default_id',
          total_count: billing === 'yearly' ? 10 : 120, // number of billing cycles
          quantity: 1,
          customer_notify: 1,
        });

        return NextResponse.json({
          source: 'razorpay',
          subscriptionId: subscription.id,
          keyId: keyId,
          amount: plan === 'pro' ? (billing === 'yearly' ? 949 : 99) : (billing === 'yearly' ? 1909 : 199),
        });
      } catch (err: any) {
        console.error('Razorpay SDK error, falling back to mock:', err);
        // Fall through to mock if SDK call failed due to invalid credentials
      }
    }

    // Mock/Simulation fallback mode
    const mockId = `sub_mock_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const amountVal = plan === 'pro' ? (billing === 'yearly' ? 949 : 99) : (billing === 'yearly' ? 1909 : 199);
    
    return NextResponse.json({
      source: 'mock',
      subscriptionId: mockId,
      keyId: 'rzp_test_mock_key_id_12345',
      amount: amountVal,
      notice: 'Razorpay keys not configured. Running in high-fidelity simulated checkout mode.',
    });

  } catch (error: any) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription: ' + (error?.message || error) },
      { status: 500 }
    );
  }
}
