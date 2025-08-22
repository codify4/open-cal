"use client"

import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { PiIcon as Api, Brain, Check, ArrowRight, Clock, Code, Heart, Shield, Users, Workflow, Zap, Folders, Bot } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Benefit {
  id: string
  title: string
  description: string
  icon: string
}

interface UseCaseBenefitsProps {
  benefits: Benefit[]
}

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  users: Users,
  brain: Brain,
  code: Code,
  api: Api,
  workflow: Workflow,
  clock: Clock,
  shield: Shield,
  heart: Heart,
  check: Check,
  arrow: ArrowRight,
  folder: Folders,
}

export function UseCaseBenefits({ benefits }: UseCaseBenefitsProps) {
  return (
    <section className="bg-black py-24 sm:py-40">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20 lg:mb-24 mt-10">
          <Badge className="bg-white/10 text-white border-white/20">Benefits</Badge>
          <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight font-lora">Why choose Caly?</h2>
          <p className="mt-4 text-white/50 max-w-2xl mx-auto leading-relaxed">Clear advantages you can explain to your team and customers.</p>
        </div>

        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20 lg:space-y-24">
          {benefits.map((benefit, idx) => {
            const Icon = iconMap[benefit.icon]
            const number = String(idx + 1).padStart(2, "0")
            const reverse = idx % 2 === 1
            return (
              <div key={benefit.id} className={`group grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-6 px-1 ${reverse ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-white/20">{number}</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      {Icon ? <Icon className="h-5 w-5 text-white/90" /> : null}
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white font-lora">{benefit.title}</h3>
                  </div>
                  <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl">{benefit.description}</p>
                </div>

                <div className={`order-first lg:order-none ${reverse ? 'lg:col-start-1' : ''}`}>
                  <div className="relative aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent transition-colors group-hover:border-white/20" />
                    <div className="relative h-full p-6 sm:p-8 lg:p-12 flex items-center justify-center">
                      {idx % 2 === 0 ? <VisualAgent /> : <VisualCalendar />}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function VisualAgent() {
  const [messageIndex, setMessageIndex] = useState(0)
  const messages = [
    "Analyzing your schedule...",
    "Found optimal time slots",
    "Best match: 2:00 PM today",
  ]
  useEffect(() => {
    const id = setInterval(() => setMessageIndex((v) => (v + 1) % messages.length), 3000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="relative w-full h-full flex flex-col justify-center">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-white/10 rounded-full mb-2" />
            <div className="h-2 bg-white/5 rounded-full w-3/4" />
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-sm">{messages[messageIndex]}</span>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1 h-1 bg-white/40 rounded-full" />
                <div className={`h-1 bg-white/10 rounded-full ${i === 1 ? 'w-full' : i === 2 ? 'w-3/4' : 'w-1/2'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function VisualCalendar() {
  return (
    <div className="relative w-full h-full">
      <div className="grid grid-cols-7 gap-2 mb-6">
        {['S','M','T','W','T','F','S'].map((d,i) => (
          <div key={i} className="h-8 flex items-center justify-center">
            <span className="text-white/40 text-xs font-medium">{d}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }, (_, i) => {
          const hasEvent = [6, 12, 18, 23].includes(i)
          const isToday = i === 15
          return (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                isToday
                  ? 'bg-white text-black font-medium shadow-lg shadow-white/20 scale-105'
                  : hasEvent
                  ? 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/15 hover:scale-105'
                  : 'text-white/40 hover:bg-white/5 hover:text-white/60 hover:scale-105'
              }`}
            >
              {i + 1}
            </div>
          )
        })}
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded bg-white/20" />
          <span className="text-white/60 text-xs">Team Meeting</span>
          <span className="text-white/40 text-xs ml-auto">2:00 PM</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded bg-white/10" />
          <span className="text-white/60 text-xs">Design Review</span>
          <span className="text-white/40 text-xs ml-auto">4:00 PM</span>
        </div>
      </div>
    </div>
  )
}