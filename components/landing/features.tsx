import { FeatureCard } from "./features/feature-card"
import { AIAgentVisual } from "./features/ai-visual"
import { CalendarVisual } from "./features/calendar-visual"
import { SmartSchedulingVisual } from "./features/schedule-visual"
import { OpenSourceVisual } from "./features/oss-visual"

export function FeaturesSection() {
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
        
        <div className="max-w-7xl mx-auto space-y-20 sm:space-y-24 lg:space-y-32">
          <FeatureCard 
            number="01"
            title="AI Calendar Agent"
            description="Your personal AI assistant that understands your schedule and helps you find the perfect time for everything."
            visual={<AIAgentVisual />}
            reverse={false}
          />
          
          <FeatureCard 
            number="02"
            title="Google Calendar Integration"
            description="Complete calendar functionality with Google Calendar integration, event management, and team scheduling."
            visual={<CalendarVisual />}
            reverse={true}
          />
          
          <FeatureCard 
            number="03"
            title="Smart Scheduling"
            description="AI-powered scheduling that finds the best time for meetings, tasks, and personal events automatically."
            visual={<SmartSchedulingVisual />}
            reverse={false}
          />
          
          <FeatureCard 
            number="04"
            title="Open Source"
            description="Built with transparency and community. Contribute, customize, and extend Caly to fit your needs."
            visual={<OpenSourceVisual />}
            reverse={true}
          />
        </div>
      </div>
    </section>
  )
}