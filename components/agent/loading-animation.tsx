'use client'

import { cn } from "@/lib/utils"

interface LoadingAnimationProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingAnimation({ className, size = 'md' }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex space-x-1">
        <div className={cn(
          "rounded-full bg-primary animate-pulse",
          sizeClasses[size]
        )} />
        <div className={cn(
          "rounded-full bg-primary/80 animate-pulse",
          sizeClasses[size]
        )} 
        style={{ animationDelay: '0.1s' }}
        />
        <div className={cn(
          "rounded-full bg-primary/60 animate-pulse",
          sizeClasses[size]
        )}
        style={{ animationDelay: '0.2s' }}
        />
      </div>
      <span className="text-sm text-muted-foreground">AI is thinking...</span>
    </div>
  )
} 