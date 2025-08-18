'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getAccessToken() {
    const { userId, getToken } = await auth();

    if (!userId) {
        return null;
    }

    const provider = 'google';

    try {
        const client = await clerkClient();
        const clerkResponse = await client.users.getUserOauthAccessToken(userId, provider);
        const accessToken = clerkResponse.data[0]?.token || '';

        if (!accessToken) {
            try {
                const freshToken = await getToken({ template: 'google' });
                console.log('Fresh token:', freshToken);
                if (freshToken) {
                    return freshToken;
                }
            } catch (refreshError) {
                console.warn('Failed to refresh token, user may need to reconnect');
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
                console.warn('Failed to refresh token, user may need to reconnect');
            }
            return null;
        }
        
        console.error('Error getting access token:', error);
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
        const clerkResponse = await client.users.getUserOauthAccessToken(session.userId, provider);
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