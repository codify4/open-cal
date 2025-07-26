"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { plans } from "@/constants/pricing"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"
import { BorderBeam } from "../magicui/border-beam"
import { useState } from "react"

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

  const monthlyPlans = plans.filter(plan => plan.name !== "Pro Yearly")
  const yearlyPlans = plans.filter(plan => plan.name !== "Pro").map(plan => {
    if (plan.name === "Pro Yearly") {
      return {
        ...plan,
        name: "Pro",
        price: "10",
        period: "/month",
        originalPrice: "20",
        billingNote: "billed yearly"
      }
    }
    return plan
  })

  const currentPlans = billingPeriod === "monthly" ? monthlyPlans : yearlyPlans

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

        <div className="flex justify-center mb-12">
          <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as "monthly" | "yearly")} className="w-fit">
            <TabsList className="bg-white/10 border border-white/20">
              <TabsTrigger 
                value="monthly" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger 
                value="yearly" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
              >
                Yearly
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-500 text-black rounded-full">
                  Save 50%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {currentPlans.map((plan, index) => (
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
                      {plan.originalPrice ? (
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-white">${plan.price}</span>
                            <span className="text-white/60 text-xl">{plan.period}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 line-through">${plan.originalPrice}/month</span>
                            <span className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded-full">
                              {plan.billingNote}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-white">${plan.price}</span>
                          <span className="text-white/60 text-xl">{plan.period}</span>
                        </div>
                      )}
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