"use client"

import { Badge } from "@/components/ui/badge"
import { Brain, Calendar, Workflow, Zap } from 'lucide-react'

interface Feature {
  id: string
  title: string
  description: string
  visual: "calendar" | "ai" | "integration" | "workflow"
}

interface UseCaseFeaturesProps {
  features: Feature[]
}

const visualMap = {
  calendar: Calendar,
  ai: Brain,
  integration: Workflow,
  workflow: Zap,
}

export function UseCaseFeatures({ features }: UseCaseFeaturesProps) {
  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-white/10 text-white border-white/20">Features</Badge>
          <h2 className="mt-6 text-4xl sm:text-5xl font-normal text-white tracking-tight font-lora">Built for your specific needs</h2>
          <p className="mt-4 text-white/50 max-w-2xl mx-auto">Practical capabilities you can use immediately.</p>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = visualMap[feature.visual]
            return (
              <div key={feature.id} className="group rounded-xl border border-white/10 bg-black/20 p-6 transition-colors hover:border-white/30">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white/90" />
                  </div>
                  <div className="text-xs font-mono text-white/40">{String(idx + 1).padStart(2, "0")}</div>
                </div>
                <h3 className="text-white text-lg sm:text-xl font-medium">{feature.title}</h3>
                <p className="mt-2 text-white/60 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}