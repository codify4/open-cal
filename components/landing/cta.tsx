'use client';

import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ripple } from '../magicui/ripple';

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-black pt-32 pb-20 lg:mx-30">
      <Ripple />
      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 flex flex-col font-bold text-4xl leading-[1.1] tracking-tight lg:text-6xl">
            <span>Never miss a meeting </span>
            <span>ever again</span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl font-medium text-muted-foreground text-xl leading-relaxed">
            Take control with Caly's AI-powered open source calendar. Sync with
            Google Calendar and let AI handle your events and time.
          </p>

          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="group rounded-full bg-white px-8 py-6 font-semibold text-black hover:bg-white/90"
              size="lg"
            >
              <Link href="/calendar" target="_blank">
                Start for free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              className="group rounded-full px-8 py-6 font-semibold"
              size="lg"
              variant="outline"
            >
              <Link href="/github" target="_blank">
                <Star
                  className="group-hover:-rotate-12 h-5 w-5 transition-transform duration-300"
                  color="yellow"
                  fill="yellow"
                />
                Give us a star
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
