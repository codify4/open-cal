import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export const useGoogleAccounts = () => {
  const { user } = useUser();
  
  const accounts = useQuery(
    api.billing.getUserGoogleAccounts,
    user?.id ? { clerkUserId: user.id } : 'skip'
  );

  return {
    accounts: accounts || [],
    isLoading: accounts === undefined,
  };
};
