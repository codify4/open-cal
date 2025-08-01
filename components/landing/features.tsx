"use client"

import { useState } from "react"
import { Eye, Shield, Calendar, Brain, Bot, Github, Star, GitBranch, Clock, CalendarCheck } from "lucide-react"
import { features } from "@/constants/features"
import Image from "next/image"

export function FeaturesSection({ page = false }: { page?: boolean }) {
  const VisualDemo = ({ type }: { type: string }) => {
    return (
      <div className="relative w-full h-80 bg-black rounded-xl overflow-hidden">
        <div className="group/card bg-neutral-950/70 p-8 w-full h-full flex items-center justify-center overflow-hidden transition-all duration-300 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:shadow-lg hover:shadow-neutral-900/30">
          {/* AI Calendar Agent */}
          {type === "upload" && (
            <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-sm shadow-lg border border-neutral-800 flex flex-col items-center transition-all duration-300 group-hover/card:scale-[1.02]">
              <div className="flex items-start self-start gap-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-neutral-200 group-hover/card:rotate-6 transition-transform duration-300" />
                  <span className="text-white text-sm font-medium">AI Assistant</span>
                  <div className="ml-auto w-2 h-2 bg-neutral-700 group-hover/card:bg-green-500 transition-colors duration-300" />
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-neutral-400">Analyzing your schedule...</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-neutral-300">Checking availability</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-100">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-neutral-300">Found optimal time</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-200">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-neutral-300">Scheduling meeting</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-400 mt-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-300">
                  ✓ Meeting scheduled for 2:00 PM
                </div>
              </div>
            </div>
          )}
          {/* Google Calendar Integration */}
          {type === "generate" && (
            <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-sm shadow-lg border border-neutral-800 flex flex-col items-center transition-all duration-300 group-hover/card:scale-[1.02]">
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck className="w-5 h-5 text-white group-hover/card:scale-110 transition-transform duration-300" />
                <span className="text-white text-sm font-medium">Calendar Features</span>
              </div>
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-xs flex items-center gap-2">
                    <Image src="/g-cal.svg" alt="Google Calendar" width={20} height={20} />
                    Google Calendar
                  </span>
                  <span className="text-xs text-green-400 group-hover/card:text-green-400 transition-colors duration-300">
                    Connected
                  </span>
                </div>
                <div className="h-2 bg-neutral-800 w-full rounded-sm" />
                <div className="h-2 bg-neutral-800 w-3/4 rounded-sm" />
                <div className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-100">
                  <div className="flex items-center gap-2 text-green-400 text-xs mt-2">
                    <Shield className="w-3 h-3" />
                    <span>Full calendar functionality</span>
                  </div>
                  <div className="text-xs text-neutral-300 mt-1">✓ Events, reminders, tasks</div>
                </div>
              </div>
            </div>
          )}
          {/* Smart Time Finding */}
          {type === "edit" && <SmartTimeFindingAnimation />}
          {/* Open Source */}
          {type === "publish" && (
            <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-sm shadow-lg border border-neutral-800 flex flex-col items-center transition-all duration-300 group-hover/card:scale-[1.02]">
              <div className="flex items-center gap-2 mb-4">
                <Github className="w-5 h-5 text-white group-hover/card:scale-110 transition-transform duration-300" />
                <span className="text-white text-sm font-medium">Open Source</span>
              </div>
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 text-xs">Repository</span>
                  <div className="flex items-center gap-2 text-neutral-500 group-hover/card:text-green-400 transition-colors duration-300">
                    <div className="w-2 h-2 bg-neutral-700 group-hover/card:bg-green-500 transition-colors duration-300" />
                    <span className="text-xs font-medium">Public</span>
                  </div>
                </div>
                <div className="opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300 delay-100">
                  <div className="bg-neutral-800 p-3 border border-neutral-700 mt-2 space-y-1 rounded-md">
                    <div className="text-xs text-white font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" /> Free to use
                    </div>
                    <div className="text-xs text-white font-medium flex items-center gap-1">
                      <GitBranch className="w-3 h-3 text-blue-400" /> Open source
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    )
  }

  return (
    <section className="relative bg-black py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Features</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            OpenCal is an open source AI calendar that helps you manage your schedule intelligently.
          </p>
        </div>
        {/* Features */}
        <div className="space-y-32 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`flex ${page ? "flex-col" : `flex-col lg:flex-row ${feature.reverse ? "lg:flex-row-reverse" : ""}`} items-center gap-16 transition-transform duration-300`}
            >
              {/* Visual */}
              <div className="flex-1 w-full">
                <VisualDemo type={feature.visual} />
              </div>
              {/* Content */}
              <div className="flex-1 space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">{feature.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {page ? feature.longDescription : feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



function SmartTimeFindingAnimation() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="bg-neutral-900 rounded-xl p-3 w-full max-w-sm shadow-lg border border-neutral-800 flex flex-col items-center transition-all duration-300 group-hover/card:scale-[1.02]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-white transition-all duration-300" />
        <span className="text-white text-sm font-medium">Smart Time Finding</span>
      </div>
      <div className="space-y-3 w-full">
        <div className="text-neutral-500 text-xs mb-2">Finding best time for:</div>
        <div className="bg-neutral-800 p-3 rounded-md border border-neutral-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-300 text-sm">Team Meeting</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Available times:</span>
            </div>
            <div className="space-y-1">
              {["9:00 AM", "2:00 PM", "4:00 PM"].map((time, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-all duration-300 ${
                    hovered && i === 1 
                      ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                      : i === 0 
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                        : i === 2
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
                          : "bg-red-700/20 text-red-400 border border-red-500/50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    hovered && i === 1 
                      ? "bg-green-500" 
                      : i === 0 
                        ? "bg-blue-500"
                        : i === 2
                          ? "bg-purple-500"
                          : "bg-red-600"
                  }`} />
                  <span>{time}</span>
                  <span className={`text-green-400 text-xs ml-auto transition-all duration-300 ${
                    hovered && i === 1 ? "opacity-100" : "opacity-0"
                  }`}>✓ Best</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-2 transition-all duration-300 ${
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}>
          <Brain className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400">AI found optimal time</span>
        </div>
      </div>
    </div>
  )
}
