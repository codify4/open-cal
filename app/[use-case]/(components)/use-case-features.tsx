"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Calendar, Workflow, Zap, ArrowRight, Sparkles } from 'lucide-react'

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
    <section className="relative py-32 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            {"Features"}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {"Built for your "}
            </span>
            <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
              {"specific needs"}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {"Practical capabilities you can use immediately."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = visualMap[feature.visual]
            const isCenter = idx === 1
            
            return (
              <div
                key={feature.id}
                className={`relative`}
              >
                <div className={`relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Feature</div>
                      <div className="text-sm font-mono text-white">{String(idx + 1).padStart(2, "0")}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-between bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl p-4 h-auto"
                    >
                      <span className="font-medium">{"Learn more"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
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
