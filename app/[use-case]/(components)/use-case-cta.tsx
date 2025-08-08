"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

interface UseCaseCTAProps {
  title: string
  description: string
  button: string
}

export function UseCaseCTA({ title, description, button }: UseCaseCTAProps) {
  return (
    <section className="relative py-32 bg-black overflow-hidden">

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center">
              <div className="space-y-6 mb-10">
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {"Get Started"}
                </Badge>
                
                <h2 className="text-3xl lg:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                    {title}
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-10 py-6 rounded-full font-bold text-lg"
                >
                  <span className="flex items-center">
                    <Zap className="mr-2 h-5 w-5" />
                    {button}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    {"Free trial"}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    {"No credit card"}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    {"Cancel anytime"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
