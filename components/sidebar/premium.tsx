'use client';

import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { ShineBorder } from '../magicui/shine-border';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

const PremiumCard = () => {
  const [close, setClose] = useState(false);

  return (
    <Card
      className={`relative mx-2 overflow-hidden rounded-xl border-none bg-white dark:bg-neutral-900 py-4 text-neutral-900 dark:text-white ${close ? 'hidden' : ''}`}
    >
      <ShineBorder
        className="absolute inset-0"
        shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']}
      />
      <CardHeader className="px-4">
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-2">
            <Sparkles className="h-4 w-4 text-black dark:text-white" />
            <p className="font-medium text-sm">Premium</p>
          </div>

          <Button
            className="absolute top-2 right-2"
            onClick={() => setClose(true)}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4 text-black dark:text-white" />
          </Button>
        </CardTitle>
        <CardDescription>
          Upgrade to the premium plan to get access to all features.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <Button className="w-full bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80">
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
};

export default PremiumCard;
