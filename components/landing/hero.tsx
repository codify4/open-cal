import { Spotlight } from "../ui/spotlight";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden">      
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div className="container mx-auto px-6 lg:px-8 xl:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="flex-1 lg:max-w-[45%] xl:max-w-[50%] space-y-6 lg:space-y-8 text-start">
            <div className="space-y-4 lg:space-y-6 text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                Never miss an event <span className="underline decoration-4 underline-offset-8">ever again</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed">
                Digit is an open-source AI calendar, offering a fresh alternative to traditional calendar applications.
              </p>
              <Button size="lg" className="group">
                Join the beta
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
