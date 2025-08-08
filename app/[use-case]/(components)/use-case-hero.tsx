"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Users, Zap, Sparkles } from 'lucide-react'

type DemoType = "calendar" | "form" | "chat"

interface CalendarDemoEvent {
  title: string
  time: string
  duration?: number
  type?: string
}

type CalendarDemoProps = {
  events?: CalendarDemoEvent[]
}

interface UseCaseHeroProps {
  title: string
  subtitle: string
  description: string
  cta: string
  demo?: {
    type: DemoType
    props: Record<string, unknown>
  }
}

function isCalendarDemo(
  demo: UseCaseHeroProps["demo"],
): demo is { type: "calendar"; props: CalendarDemoProps } {
  return demo?.type === "calendar"
}

export function UseCaseHero({
  title,
  subtitle,
  description,
  cta,
  demo,
}: UseCaseHeroProps) {
  const defaultEvents: CalendarDemoEvent[] = [
    { title: "Investor Demo", time: "10:00 AM", duration: 60, type: "meeting" },
    { title: "Customer Call", time: "2:00 PM", duration: 30, type: "sales" },
    { title: "Team Standup", time: "9:00 AM", duration: 15, type: "internal" },
  ]

  const events: CalendarDemoEvent[] =
    isCalendarDemo(demo) && Array.isArray(demo.props.events)
      ? (demo.props.events as CalendarDemoEvent[])
      : defaultEvents

  const typeToColor: Record<string, { bg: string; glow: string }> = {
    meeting: { bg: "bg-gradient-to-r from-white to-gray-300", glow: "shadow-white/20" },
    sales: { bg: "bg-gradient-to-r from-gray-200 to-gray-400", glow: "shadow-gray-300/20" },
    internal: { bg: "bg-gradient-to-r from-gray-300 to-gray-500", glow: "shadow-gray-400/20" },
    default: { bg: "bg-gradient-to-r from-gray-400 to-gray-600", glow: "shadow-gray-500/20" },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <Sparkles className="w-3 h-3 mr-1" />
                {subtitle}
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                  {title.split(' ').slice(0, -2).join(' ')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
                  {title.split(' ').slice(-2).join(' ')}
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">{description}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg"
              >
                <span className="flex items-center">
                  {cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <Zap className="h-4 w-4" />
                  {"AI-powered"}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  <Users className="h-4 w-4" />
                  {"Team ready"}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <Clock className="h-4 w-4" />
                  {"5 min setup"}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">{"Your schedule at a glance"}</h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
              </div>
              
              <div className="space-y-4">
                {events.slice(0, 4).map((event, idx) => {
                  const colors = typeToColor[event.type ?? "default"] ?? typeToColor.default
                  return (
                    <div
                      key={`${event.title}-${idx}`}
                      className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-4 h-4 rounded-full ${colors.bg} shadow-lg ${colors.glow}`} />
                          <div>
                            <div className="font-medium text-white">{event.title}</div>
                            <div className="text-sm text-gray-400">{event.duration}min</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-white">{event.time}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Today</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
