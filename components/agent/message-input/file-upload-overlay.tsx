'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Paperclip } from 'lucide-react';

interface FileUploadOverlayProps {
  isDragging: boolean;
}

export function FileUploadOverlay({ isDragging }: FileUploadOverlayProps) {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center space-x-2 rounded-xl border border-border border-dashed bg-background text-muted-foreground text-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Paperclip className="h-4 w-4" />
          <span>Drop your files here to attach them.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
