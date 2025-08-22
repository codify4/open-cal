'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Square, X } from 'lucide-react';

interface InterruptPromptProps {
  isOpen: boolean;
  close: () => void;
  onStop?: () => void;
}

export function InterruptPrompt({
  isOpen,
  close,
  onStop,
}: InterruptPromptProps) {
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
          {onStop && (
            <button
              aria-label="Stop generating"
              className="mr-1 ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onStop}
              type="button"
            >
              <Square className="h-2.5 w-2.5" fill="currentColor" />
            </button>
          )}
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
