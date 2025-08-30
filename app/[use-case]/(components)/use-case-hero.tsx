"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket, Code, Target, TrendingUp, Globe, Briefcase, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UseCaseHeroProps {
    title: string
    subtitle: string
    description: string
    cta: string
    icon: string
}

export function UseCaseHero({
    title,
    subtitle,
    description,
    cta,
    icon,
}: UseCaseHeroProps) {
    const iconMap = {
        rocket: Rocket,
        code: Code,
        target: Target,
        'trending-up': TrendingUp,
        globe: Globe,
        briefcase: Briefcase,
        users: Users,
    }

    const IconComponent = iconMap[icon as keyof typeof iconMap] || Rocket

    return (
        <section className="bg-black py-24 sm:py-40">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center gap-16 mt-20">
                    <div className="space-y-6 flex flex-col items-center justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-white/60">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-xs">{subtitle}</span>
                        </div>
                        <h1 className="font-lora text-5xl sm:text-6xl text-white tracking-tight text-center">
                        {title}
                        </h1>
                        <p className="text-lg text-white/80 max-w-2xl text-center">{description}</p>
                        <Button asChild size="lg" className="group px-8 py-6 rounded-full font-semibold bg-white text-black hover:bg-white/90 w-fit">
                        <Link href="/calendar">
                            {cta}
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        </Button>
                    </div>

                    <div className='bg-neutral-950 p-1 rounded-xl border-2 border-white/20 w-[1000px] lg:h-full overflow-hidden self-start lg:self-center'>
                        <Image src="/hero.png" alt="Caly Hero" width={1003} height={553} className='rounded-xl' />
                    </div>
                </div>
            </div>
        </section>
    )
}