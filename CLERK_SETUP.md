# Clerk Integration Setup

## Environment Variables

Create a `.env.local` file in your project root with the following Clerk keys:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGlyZWN0LWNvd2JpcmQtNjcuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_DkMEP2vViENiKUAnSCzgtPK328surPXFTLTNiKShGm
```

## What's Been Added

1. **Middleware** (`middleware.ts`) - Uses `clerkMiddleware()` for route protection
2. **Layout Update** (`app/layout.tsx`) - Wrapped with `<ClerkProvider>`
3. **Auth Header** (`components/auth-header.tsx`) - Sign in/up buttons and user menu
4. **Protected Route** (`app/dashboard/page.tsx`) - Example of server-side authentication
5. **Homepage Integration** - Added auth header to main page

## Usage Examples

### Server-Side Authentication
```typescript
import { auth } from '@clerk/nextjs/server';

export default async function ProtectedPage() {
  const { userId } = await auth();
  // userId will be available for authenticated users
}
```

### Client-Side Components
```typescript
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function UserMenu() {
  return (
    <>
      <SignedOut>
        <p>Please sign in</p>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
```

## Next Steps

1. Add the environment variables to your `.env.local` file
2. Test the authentication flow by visiting `/dashboard`
3. Customize the auth header styling to match your design
4. Add more protected routes as needed
