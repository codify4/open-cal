"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Quote, Star } from 'lucide-react'

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
}

interface UseCaseTestimonialsProps {
  testimonials: Testimonial[]
}

export function UseCaseTestimonials({ testimonials }: UseCaseTestimonialsProps) {
  return (
    <section className="relative py-32 bg-black overflow-hidden">

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            {"Testimonials"}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {"Loved by teams "}
            </span>
            <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
              {"worldwide"}
            </span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          {testimonials.map((t, i) => {
            const initials = t.author
              .split(" ")
              .map((n) => n[0])
              .join("")
            
            return (
              <div
                key={`${t.author}-${i}`}
                className="group relative"
              >
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full">
                  {/* Quote icon and stars */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/20 flex items-center justify-center">
                      <Quote className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-white text-white opacity-80" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg text-white leading-relaxed mb-8 font-medium">
                    {'"'}
                    {t.quote}
                    {'"'}
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12 border-2 border-white/20">
                        <AvatarImage
                          src={`/api/avatar/${encodeURIComponent(t.author)}`}
                          alt={t.author}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-white to-gray-300 text-black font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-black" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{t.author}</div>
                      <div className="text-sm text-gray-400">
                        {t.role}
                        {" • "}
                        <span className="text-gray-300">{t.company}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
