import { NextRequest, NextResponse } from 'next/server';
import { polarClient } from '@/lib/polar';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const customerId = searchParams.get('customer_id');
  const returnUrl = searchParams.get('return_url') || `${process.env.NEXT_PUBLIC_APP_URL}/calendar`;

  if (!customerId) {
    return NextResponse.json({ error: 'Missing customer_id parameter' }, { status: 400 });
  }

  try {
    const session = await polarClient.customerPortal.create({
      customerId,
      returnUrl,
    });

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json({ error: 'Failed to create customer portal session' }, { status: 500 });
  }
}
