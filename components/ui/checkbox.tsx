"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const getColorClasses = (color?: string) => {
  if (!color) return ""
  
  const colorMap: Record<string, string> = {
    "bg-blue-500": "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
    "bg-green-500": "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
    "bg-red-500": "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500",
    "bg-yellow-500": "data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500",
    "bg-purple-500": "data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
    "bg-orange-500": "data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500",
  }
  
  return colorMap[color] || ""
}

function Checkbox({
  className,
  color,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  color?: string
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        getColorClasses(color),
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn("flex items-center justify-center text-current transition-none", color)}
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
