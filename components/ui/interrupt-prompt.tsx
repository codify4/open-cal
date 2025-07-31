'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface InterruptPromptProps {
  isOpen: boolean;
  close: () => void;
}

export function InterruptPrompt({ isOpen, close }: InterruptPromptProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{
            top: -40,
            filter: 'blur(0px)',
            transition: {
              type: 'spring',
              filter: { type: 'tween' },
            },
          }}
          className="-translate-x-1/2 absolute left-1/2 flex overflow-hidden whitespace-nowrap rounded-full border bg-background py-1 text-center text-muted-foreground text-sm"
          exit={{ top: 0, filter: 'blur(5px)' }}
          initial={{ top: 0, filter: 'blur(5px)' }}
        >
          <span className="ml-2.5">Press Enter again to interrupt</span>
          <button
            aria-label="Close"
            className="mr-2.5 ml-1 flex items-center"
            onClick={close}
            type="button"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
