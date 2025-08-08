export const plans: Array<{
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  originalPrice?: string;
  billingNote?: string;
  lemonVariantEnv?: string;
}> = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    features: [
      '3 AI messages per day',
      'Calendar integration',
      'Standard calendar actions',
      'Unlimited events creation',
    ],
    cta: 'Try it out',
  },
  {
    name: 'Pro',
    price: '20',
    period: '/month',
    features: [
      'Everything in Free',
      'Unlimited AI messages',
      'Multiple accounts',
      'Priority support',
    ],
    cta: 'Get started',
    lemonVariantEnv: 'LEMONSQUEEZY_VARIANT_MONTHLY_ID',
  },
  {
    name: 'Pro Yearly',
    price: '10',
    period: '/month',
    features: [
      'Everything in Free',
      'Unlimited AI messages',
      'Multiple accounts',
      'Priority support',
    ],
    cta: 'Get started',
    lemonVariantEnv: 'LEMONSQUEEZY_VARIANT_YEARLY_ID',
  },
];
