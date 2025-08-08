'use client'

import { authClient } from '@/lib/auth-client'

export function SignInButton() {
  const onClick = () => authClient.signIn.social({ provider: 'google' })
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20">
      Sign in with Google
    </button>
  )
}


