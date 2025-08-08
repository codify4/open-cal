"use client"

import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { PiIcon as Api, Brain, Clock, Code, Heart, Shield, Users, Workflow, Zap } from 'lucide-react'

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
}

export function UseCaseBenefits({ benefits }: UseCaseBenefitsProps) {
  return (
    <section className="relative py-32 bg-black overflow-hidden">

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            {"Key Benefits"}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {"Why choose "}
            </span>
            <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
              {"Caly?"}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {"Clear advantages you can explain to your team and customers."}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, idx) => {
            const Icon = iconMap[benefit.icon]
            
            return (
              <div
                key={benefit.id}
                className="relative"
              >
                <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-gray-300 p-0.5">
                      <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                        {Icon && <Icon className="h-8 w-8 text-white" />}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">{String(idx + 1).padStart(2, "0")}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {benefit.description}
                    </p>
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
