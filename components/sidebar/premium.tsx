'use client';

import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Premium = () => {
    const onBetaClick = () => {
        toast.error('Coming soon!');
    }
    return (
        <Button 
            variant="outline" 
            className="flex items-center justify-start w-full py-2.5 rounded-sm text-sm font-medium text-neutral-900 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:text-neutral-200 focus:ring-0"
            onClick={onBetaClick}
        >
            <Sparkles className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
            <span>Upgrade to Pro</span>
        </Button>
  );
};

export default Premium;
