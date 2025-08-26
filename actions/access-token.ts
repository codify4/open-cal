'use server';

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export async function getAccessToken() {
  const { userId, getToken } = await auth();

  if (!userId) {
    return null;
  }

  const provider = 'google';

  try {
    const client = await clerkClient();
    
    const headersList = await headers();
    const sessionId = headersList.get('x-clerk-session-id');
    
    if (sessionId) {
      const session = await client.sessions.getSession(sessionId);
      
      if (session.userId && session.userId === userId) {
        const clerkResponse = await client.users.getUserOauthAccessToken(
          session.userId,
          provider
        );
        const accessToken = clerkResponse.data[0]?.token || '';
        
        if (accessToken) {
          return accessToken;
        }
      }
    }

    const clerkResponse = await client.users.getUserOauthAccessToken(
      userId,
      provider
    );
    const accessToken = clerkResponse.data[0]?.token || '';

    if (!accessToken) {
      try {
        const freshToken = await getToken({ template: 'google' });
        if (freshToken) {
          return freshToken;
        }
      } catch (refreshError) {
        return null;
      }
      return null;
    }

    return accessToken;
  } catch (error: any) {
    if (error.status === 422) {
      try {
        const freshToken = await getToken({ template: 'google' });
        if (freshToken) {
          return freshToken;
        }
      } catch (refreshError) {
        return null;
      }
      return null;
    }

    return null;
  }
}

export async function getAccessTokenForSession(sessionId: string) {
  try {
    const client = await clerkClient();
    const session = await client.sessions.getSession(sessionId);

    if (!session.userId) {
      return null;
    }

    const provider = 'google';
    const clerkResponse = await client.users.getUserOauthAccessToken(
      session.userId,
      provider
    );
    const accessToken = clerkResponse.data[0]?.token || '';

    if (!accessToken) {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('Error getting access token for session:', error);
    return null;
  }
}

export async function saveGoogleAccountInfo() {
  console.log('Starting saveGoogleAccountInfo');
  
  try {
    const user = await currentUser();
    
    if (!user) {
      console.log('No current user found');
      return;
    }

    console.log('Clerk user found:', user.id);
    console.log('External accounts:', user.externalAccounts.length);
    
    const googleAccounts = user.externalAccounts.filter(
      (account) => account.provider === 'oauth_google'
    );
    
    console.log('Google OAuth accounts found:', googleAccounts.length);
    console.log('Google accounts:', googleAccounts);

    for (const account of googleAccounts) {
      console.log('Processing Google account:', account.emailAddress, account.externalId);
      
      try {
        const result = await fetchMutation(api.auth.addGoogleAccountToCurrentUser, {
          clerkUserId: user.id,
          googleUserId: account.externalId,
          email: account.emailAddress,
        });
        
        console.log('Successfully saved Google account:', result);
      } catch (error) {
        console.error('Failed to save Google account:', error);
      }
    }
  } catch (error) {
    console.error('Error in saveGoogleAccountInfo:', error);
  }
}
