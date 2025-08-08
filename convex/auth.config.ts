export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: 'convex',
    },
    {
        domain: "http://localhost:3000",
        applicationID: 'convex',
    },
  ],
}


