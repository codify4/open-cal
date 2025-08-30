import { initBotId } from 'botid/client/core';
 
// Define the paths that need bot protection.
// These are paths that are routed to by your app.
// These can be:
// - API endpoints (e.g., '/api/checkout')
// - Server actions invoked from a page (e.g., '/dashboard')
// - Dynamic routes (e.g., '/api/create/*')
 
initBotId({
    protect: [
        {
            path: '/api/polar/customer-portal',
            method: 'GET',
        },
        {
            path: '/api/polar/checkout',
            method: 'GET',
        },
        {
            path: '/api/polar/webhook',
            method: 'POST',
        },
        {
            // Wildcards can be used to expand multiple segments
            // /team/*/activate will match
            // /team/a/activate
            // /team/a/b/activate
            // /team/a/b/c/activate
            // ...
            path: '/api/calendar/check-conflicts',
            method: 'POST',
        },
        {
            // Wildcards can also be used at the end for dynamic routes
            path: '/api/chat',
            method: 'POST',
        },
    ],
});