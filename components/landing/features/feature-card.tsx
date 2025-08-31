'use client'

import { ArrowRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"


interface FeatureCardProps {
  number: string
  title: string
  description: string
  visual: React.ReactNode
  reverse?: boolean
}

export function FeatureCard({ number, title, description, visual, reverse = false }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-24 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`space-y-6 sm:space-y-8 px-4 sm:px-0 ${reverse ? 'lg:col-start-2' : ''}`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-white/20">{number}</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>
        
        <div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4 sm:mb-6 leading-tight font-lora">
            {title}
          </h3>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-6 sm:mb-8 max-w-lg">
            {description}
          </p>
          
          <Link href="/calendar" className="group inline-flex items-center gap-3 sm:gap-4 text-white hover:text-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer">
            <span className="text-sm font-medium tracking-wide">Explore feature</span>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isHovered 
                ? 'border-white bg-white shadow-lg shadow-white/20 scale-105' 
                : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10'
            }`}>
              <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isHovered ? 'translate-x-1 text-black' : 'text-white'
              }`} />
            </div>
          </Link>
        </div>
      </div>
      
      <div className={`order-first lg:order-none ${reverse ? 'lg:col-start-1' : ''}`}>
        <div className="relative px-4 sm:px-0">
          {visual}
        </div>
      </div>
    </div>
  )
}   