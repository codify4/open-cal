'use client';

import { Github, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function RoadmapCTA() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-8 text-center md:p-12">
        <div className="space-y-4">
          <h2 className="font-bold text-3xl md:text-4xl">
            Help Shape the Future
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
            OpenCal is built by the community, for the community. Your feedback,
            contributions, and ideas help us build the best calendar platform.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/github" target="_blank">
            <Button className="gap-2" size="lg">
              <Github className="h-5 w-5" />
              Contribute on GitHub
            </Button>
          </Link>

          <Link href="/github" target="_blank">
            <Button className="gap-2" size="lg" variant="outline">
              <Star className="h-5 w-5" fill="yellow" stroke="yellow" />
              Give us a star
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
