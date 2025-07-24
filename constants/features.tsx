import { CalendarIcon, UsersIcon, MessageCircleIcon, ZapIcon, Sparkles } from "lucide-react"
import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface Feature {
  Icon: React.ElementType
  name: string
  description: string
  href: string
  cta: string
  className: string
  background: React.ReactNode
}

export const features: Feature[] = [
  {
    Icon: CalendarIcon,
    name: "Calendar Events",
    description: "Create, edit, and manage all your events with a beautiful, intuitive interface.",
    href: "#",
    cta: "See events",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Card className="absolute inset-0 border-0 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="p-0 h-full flex items-center justify-center">
          <Badge variant="secondary" className="text-xs">
            Events
          </Badge>
        </CardContent>
      </Card>
    ),
  },
  {
    Icon: UsersIcon,
    name: "Google Calendar Integration",
    description: "Connect and manage multiple calendar accounts in one unified interface.",
    href: "#",
    cta: "Connect accounts",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Card className="absolute inset-0 border-0 bg-gradient-to-br from-secondary/10 to-secondary/5">
        <CardContent className="p-0 h-full flex items-center justify-center">
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">Gmail</Badge>
            <Badge variant="outline" className="text-xs">Outlook</Badge>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    Icon: Sparkles,
    name: "Ask AI About Anything in Your Calendar",
    description: "Get intelligent insights and answers about your schedule with natural language queries.",
    href: "#",
    cta: "Ask AI",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Card className="absolute inset-0 border-0 bg-gradient-to-br from-accent/10 to-accent/5">
        <CardContent className="p-0 h-full flex items-center justify-center">
          <Button variant="ghost" size="sm" className="text-xs">
            "What's my schedule today?"
          </Button>
        </CardContent>
      </Card>
    ),
  },
  {
    Icon: ZapIcon,
    name: "Calendar Actions Optimized with AI",
    description: "Let AI suggest optimal meeting times, detect conflicts, and automate scheduling tasks.",
    href: "#",
    cta: "Optimize now",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Card className="absolute inset-0 border-0 bg-gradient-to-br from-muted/10 to-muted/5">
        <CardContent className="p-0 h-full flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">AI</Badge>
            <span className="text-xs text-muted-foreground">Optimized</span>
          </div>
        </CardContent>
      </Card>
    ),
  },
] 