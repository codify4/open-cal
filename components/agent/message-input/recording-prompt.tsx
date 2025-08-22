'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface RecordingPromptProps {
  isVisible: boolean;
  onStopRecording: () => void;
}

export function RecordingPrompt({ isVisible, onStopRecording }: RecordingPromptProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{
            top: -40,
            filter: 'blur(0px)',
            transition: {
              type: 'spring',
              filter: { type: 'tween' },
            },
          }}
          className="-translate-x-1/2 absolute left-1/2 flex cursor-pointer overflow-hidden whitespace-nowrap rounded-full border bg-background py-1 text-center text-muted-foreground text-sm"
          exit={{ top: 0, filter: 'blur(5px)' }}
          initial={{ top: 0, filter: 'blur(5px)' }}
          onClick={onStopRecording}
        >
          <span className="mx-2.5 flex items-center">
            <Info className="mr-2 h-3 w-3" />
            Click to finish recording
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
