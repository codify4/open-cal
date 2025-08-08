'use client';

import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { plans } from '@/constants/pricing';
import { BorderBeam } from '../magicui/border-beam';

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const monthlyPlans = plans.filter((plan) => plan.name !== 'Pro Yearly');
  const yearlyPlans = plans
    .filter((plan) => plan.name !== 'Pro')
    .map((plan) => {
      if (plan.name === 'Pro Yearly') {
        return {
          ...plan,
          name: 'Pro',
          price: '10',
          period: '/month',
          originalPrice: '20',
          billingNote: 'billed yearly',
        };
      }
      return plan;
    });

  const currentPlans = billingPeriod === 'monthly' ? monthlyPlans : yearlyPlans;

  return (
    <section
      className="relative overflow-hidden bg-black py-32 text-white"
      id="pricing"
    >
      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-4 font-bold text-5xl leading-tight tracking-tight lg:text-6xl">
            Pricing
          </h2>
          <p className="mx-auto max-w-2xl font-light text-white/70 text-xl leading-relaxed">
            Choose the perfect plan for your AI calendar
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <Tabs
            className="w-fit"
            onValueChange={(value) =>
              setBillingPeriod(value as 'monthly' | 'yearly')
            }
            value={billingPeriod}
          >
            <TabsList className="border border-white/20 bg-white/10">
              <TabsTrigger
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                value="monthly"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                value="yearly"
              >
                Yearly
                <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-black text-xs">
                  Save 50%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          {currentPlans.map((plan, index) => (
            <div
              className={
                'group relative transition-all duration-500 hover:scale-[1.02]'
              }
              key={index}
            >
              <div
                className={
                  'relative flex h-full flex-col justify-between rounded-xl border border-white/50 bg-black p-8 transition-all duration-300 hover:border-white/70'
                }
              >
                <div className="flex flex-col justify-start">
                  <div className="mb-6">
                    <h3 className="mb-2 font-bold text-2xl text-white">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      {plan.originalPrice ? (
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-5xl text-white">
                              ${plan.price}
                            </span>
                            <span className="text-white/60 text-xl">
                              {plan.period}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 line-through">
                              ${plan.originalPrice}/month
                            </span>
                            <span className="rounded-full bg-green-400/10 px-2 py-1 font-medium text-green-400 text-sm">
                              {plan.billingNote}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-5xl text-white">
                            ${plan.price}
                          </span>
                          <span className="text-white/60 text-xl">
                            {plan.period}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li className="flex items-start" key={featureIndex}>
                        <div className="mt-0.5 mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                          <Check className="h-3 w-3 text-white transition-colors duration-200" />
                        </div>
                        <span className="text-white/80 leading-relaxed transition-colors duration-200 group-hover:text-white">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Button asChild className="group w-full rounded-full py-5">
                    <Link
                      href='/calendar'
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              {plan.name === 'Pro' && (
                <>
                  <BorderBeam
                    className="from-[#ffaa40] via-[#9c40ff] to-transparent"
                    duration={6}
                    size={400}
                  />
                  <BorderBeam
                    borderWidth={2}
                    className="from-[] via-[#9c40ff] to-transparent"
                    delay={3}
                    duration={6}
                    size={400}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
