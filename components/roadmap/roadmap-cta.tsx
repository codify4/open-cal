"use client"

import { Button } from "@/components/ui/button"
import { Github,  Star } from "lucide-react"
import Link from "next/link"

export function RoadmapCTA() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 text-center space-y-8">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Help Shape the Future
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        OpenCal is built by the community, for the community. Your feedback, 
                        contributions, and ideas help us build the best calendar platform.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/github" target="_blank">
                        <Button size="lg" className="gap-2">
                            <Github className="w-5 h-5" />
                            Contribute on GitHub
                        </Button>
                    </Link>
                    
                    <Link href="/github" target="_blank">
                        <Button variant="outline" size="lg" className="gap-2">
                            <Star className="w-5 h-5" fill="yellow" stroke="yellow" />
                            Give us a star
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
} 