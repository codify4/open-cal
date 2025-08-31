"use client"

import { useState } from "react"
import { ArrowRight, ChevronRight, ChevronsRight } from "lucide-react"
import Link from "next/link"
import { AIAgentVisual } from "./features/ai-visual"
import { CalendarVisual } from "./features/calendar-visual"
import { SmartSchedulingVisual } from "./features/schedule-visual"
import { OpenSourceVisual } from "./features/oss-visual"

export function FeaturesSection() {
  const [selectedFeature, setSelectedFeature] = useState(0)
  
  const features = [
    {
      number: "01",
      title: "AI Calendar Agent",
      description: "Your personal AI assistant that understands your schedule and helps you find the perfect time for everything.",
      visual: <AIAgentVisual />
    },
    {
      number: "02", 
      title: "Google Calendar Integration",
      description: "Complete calendar functionality with Google Calendar integration, event management, and team scheduling.",
      visual: <CalendarVisual />
    },
    {
      number: "03",
      title: "Smart Scheduling", 
      description: "AI-powered scheduling that finds the best time for meetings, tasks, and personal events automatically.",
      visual: <SmartSchedulingVisual />
    },
    {
      number: "04",
      title: "Open Source",
      description: "Built with transparency and community. Contribute, customize, and extend Caly to fit your needs.",
      visual: <OpenSourceVisual />
    }
  ]
  
  const selectedFeatureData = features[selectedFeature]
  
  return (
    <section className="relative bg-black py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-white/10 mb-6 sm:mb-8">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/60 text-xs sm:text-sm">Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal text-white mb-4 sm:mb-6 tracking-tight font-lora px-4">
            Intelligent by design
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed px-4">
            Experience calendar management that thinks ahead, adapts to your needs, and learns from your patterns.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Feature Buttons */}
            <div className="space-y-2">
              {features.map((feature, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedFeature(i)}
                  className={`group w-full text-left rounded-lg px-3 py-2 transition-all duration-300 cursor-pointer ${
                    i === selectedFeature
                      ? 'bg-gradient-to-l from-white/10 to-transparent'
                      : 'bg-transparent border-none'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-light text-white/20">{feature.number}</span>
                    <div className="h-px bg-white/10 flex-1" />
                    <ChevronRight size={24} className={`group-hover:translate-x-1 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      i === selectedFeature ? 'text-white translate-x-1' : 'text-white/40'
                    }`} />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white mb-1 leading-tight font-lora">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed max-w-lg">
                      {feature.description}
                    </p>
                  </div>
                </button>
              ))}
              
              <div className="pt-1">
                <Link href="/calendar" className="group inline-flex items-center gap-2 text-white hover:text-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer">
                  <span className="text-sm font-medium tracking-wide">Explore all features</span>
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-white/30 bg-white hover:border-white/50 hover:bg-white/80">
                    <ArrowRight size={16} className="text-black transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Right Column - Visual Display */}
            <div className="relative">
              <div className="sticky top-8">
                {selectedFeatureData.visual}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}