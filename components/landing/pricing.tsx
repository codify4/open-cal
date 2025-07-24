"use client"

import { Button } from "@/components/ui/button"
import { plans } from "@/constants/pricing"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"
import { BorderBeam } from "../magicui/border-beam"

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-tight">
            Pricing
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
            Choose the perfect plan for your AI calendar
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group transition-all duration-500 hover:scale-[1.02]`}
            > 
              <div
                className={`flex flex-col justify-between relative bg-black border rounded-xl p-8 h-full transition-all duration-300 border-white/50 hover:border-white/70`}
              >
                <div className="flex flex-col justify-start">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-5xl font-bold text-white">${plan.price}</span>
                        <span className="text-white/60 ml-2 text-lg">{plan.period}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mr-3 mt-0.5">
                          <Check className="h-3 w-3 text-white transition-colors duration-200" />
                        </div>
                        <span className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-200">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Button 
                    className="w-full py-5 rounded-full group"
                    asChild
                  >
                    <Link href={plan.cta === "Contact sales" ? "/contact" : "/signup"}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  </Button>
                </div>
              </div>
              {plan.name === "Pro" && (
                <>
                  <BorderBeam
                    duration={6}
                    size={400}
                    className="from-[#ffaa40] via-[#9c40ff] to-transparent"
                  />
                  <BorderBeam
                    duration={6}
                    delay={3}
                    size={400}
                    borderWidth={2}
                    className="from-[] via-[#9c40ff] to-transparent"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}