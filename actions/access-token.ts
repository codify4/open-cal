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
            await getToken({ template: 'google' });
            return null;
        }

        return accessToken;
    } catch (error: any) {
        if (error.status === 422) {
            console.warn('OAuth token not available, user may need to reconnect Google account');
            return null;
        }
        
        console.error('Error getting access token:', error);
        return null;
    }
}