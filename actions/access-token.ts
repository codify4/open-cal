'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getAccessToken() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const provider = 'google'

    const client = await clerkClient()

    const clerkResponse = await client.users.getUserOauthAccessToken(userId, provider)

    const accessToken = clerkResponse.data[0]?.token || ''

    if (!accessToken) {
        return null;
    }

    return accessToken;
}