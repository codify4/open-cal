export default {
  providers: [
    {
      domain: process.env.CLERK_FRONTEND_API_URL,
      applicationID: 'convex',
    },
  ],
  getUserMetadata: async (token: string) => {
    const response = await fetch(
      `${process.env.CLERK_FRONTEND_API_URL}/v1/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user metadata');
    }

    const user = await response.json();
    return {
      userId: user.id,
      email: user.email_addresses[0]?.email_address,
      name:
        user.first_name && user.last_name
          ? `${user.first_name} ${user.last_name}`
          : undefined,
    };
  },
};
