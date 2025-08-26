'use client';

import { useSession, useSessionList } from '@clerk/nextjs';
import React, { useEffect, useRef, useState } from 'react';

export default function MultisessionAppSupport({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();
  const { sessions, setActive } = useSessionList();
  const proPlanSessionId = useRef<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (sessions && sessions.length > 0 && !proPlanSessionId.current) {
      proPlanSessionId.current = sessions[0].id;
    }
  }, [sessions]);

  useEffect(() => {
    if (session && proPlanSessionId.current && session.id !== proPlanSessionId.current) {
      setIsSwitching(true);
      setActive?.({ session: proPlanSessionId.current });
      
      // Hide the switching state after a delay
      setTimeout(() => {
        setIsSwitching(false);
      }, 1000);
    }
  }, [session, setActive]);

  if (isSwitching) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Adding account...</p>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}
