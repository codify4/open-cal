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
    {
        domain: "https://24f67c73cc1c04e043140a3945238ffb.loophole.site",
        applicationID: 'convex',
    },
  ],
}


