
"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"
import { Ripple } from "../magicui/ripple"
import Link from "next/link"

export function CTASection() {
    return (
        <section className="pt-32 pb-20 relative overflow-hidden lg:mx-30 bg-black">
            <Ripple />
            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="flex flex-col text-4xl lg:text-6xl font-bold mb-8 tracking-tight leading-[1.1]">
                        <span>Never miss a meeting {" "}</span>
                        <span>ever again</span>
                    </h2>

                    <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        Take control with Caly's AI-powered open source calendar. Sync with Google Calendar and let AI handle your events and time.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Button asChild size="lg" className="group px-8 py-6 rounded-full font-semibold bg-white text-black hover:bg-white/90">
                            <Link href="/calendar" target="_blank">
                                Start for free
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="group px-8 py-6 rounded-full font-semibold" variant="outline">
                            <Link href="/github" target="_blank">
                                <Star className="h-5 w-5 group-hover:-rotate-12 transition-transform duration-300" fill="yellow" color="yellow" />
                                Give us a star
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
