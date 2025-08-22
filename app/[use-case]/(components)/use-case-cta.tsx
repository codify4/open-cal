"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from 'lucide-react'
import Link from "next/link"

interface UseCaseCTAProps {
  title: string
  description: string
  button: string
}

export function UseCaseCTA({ title, description, button }: UseCaseCTAProps) {
  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center rounded-3xl border border-white/10 bg-white/5 p-10">
          <Badge className="bg-white/10 text-white border-white/20">Get started</Badge>
          <h2 className="mt-6 text-4xl sm:text-5xl font-normal text-white tracking-tight font-lora">{title}</h2>
          <p className="mt-4 text-white/60">{description}</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild size="lg" className="group px-8 py-6 rounded-full font-semibold bg-white text-black hover:bg-white/90">
              <Link href="/calendar">
                {button}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Link href="/github" target="_blank">
              <Button variant="outline" size="lg" className="group gap-2 rounded-full px-8 py-6 bg-white/10 hover:bg-white/20 border-white/10">
                <Star className="h-5 w-5 group-hover:-rotate-12 transition-transform duration-300" fill="yellow" stroke="yellow" />
                <span className="text-white">Give us a star</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
