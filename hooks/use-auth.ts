import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useEffect } from 'react'

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser()
  const createUser = useMutation(api.auth.createUser)
  const updateUser = useMutation(api.auth.updateUser)
  const currentUser = useQuery(api.auth.getCurrentUser, { 
    clerkUserId: user?.id 
  })

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !currentUser) {
      createUser({
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || undefined,
      })
    }
  }, [isLoaded, isSignedIn, user, currentUser, createUser])

  useEffect(() => {
    if (isLoaded && isSignedIn && user && currentUser) {
      const needsUpdate = 
        currentUser.email !== user.primaryEmailAddress?.emailAddress ||
        currentUser.name !== user.fullName
      
      if (needsUpdate) {
        updateUser({
          clerkUserId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          name: user.fullName || undefined,
        })
      }
    }
  }, [isLoaded, isSignedIn, user, currentUser, updateUser])

  return {
    user: currentUser,
    isLoaded,
    isSignedIn,
    clerkUser: user,
  }
}
