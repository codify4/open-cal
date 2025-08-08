'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from '../ui/button'

export function SignInButton() {
    const onClick = () =>
        authClient.signIn.social({
            provider: 'google',
            callbackURL: `${window.location.origin}/calendar`,
            errorCallbackURL: `${window.location.origin}/`,
            newUserCallbackURL: `${window.location.origin}/calendar`,
        })
    return (
        <Button onClick={onClick} className="inline-flex items-center rounded-md  px-3 py-2 text-sm font-medium">
            Sign in with Google
        </Button>
    )
}


