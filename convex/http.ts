import { httpRouter } from 'convex/server';
import { api } from './_generated/api';
import { action } from './_generated/server';

const http = httpRouter();

http.route({
  path: '/auth/google',
  method: 'POST',
  handler: action(async (ctx, request) => {
    const {
      clerkUserId,
      googleUserId,
      email,
      accessToken,
      refreshToken,
      expiresAt,
      scopes,
    } = await request.json();

    if (
      !(
        clerkUserId &&
        googleUserId &&
        email &&
        accessToken &&
        expiresAt &&
        scopes
      )
    ) {
      return new Response('Missing required fields', { status: 400 });
    }

    try {
      await ctx.runMutation(api.auth.saveGoogleAccount, {
        clerkUserId,
        googleUserId,
        email,
        accessToken,
        refreshToken,
        expiresAt,
        scopes,
      });

      return new Response('Google account saved successfully', { status: 200 });
    } catch (error) {
      console.error('Failed to save Google account:', error);
      return new Response('Failed to save Google account', { status: 500 });
    }
  }),
});

export default http;
