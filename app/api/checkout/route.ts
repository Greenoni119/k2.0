import { stripe } from '@/lib/stripe-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { items, returnUrl } = await req.json();

    if (!items?.length) {
      return NextResponse.json(
        { error: 'Please provide items to checkout' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.images || [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${returnUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error in checkout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
