"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

interface FAQ {
  question: string
  answer: string
}

interface UseCaseFAQProps {
  faq: FAQ[]
}

export function UseCaseFAQ({ faq }: UseCaseFAQProps) {
  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-white/10 text-white border-white/20">FAQ</Badge>
          <h2 className="mt-6 text-4xl sm:text-5xl font-normal text-white tracking-tight font-lora">Frequently asked questions</h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion className="space-y-4" collapsible type="single">
            {faq.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-0">
                <div className="rounded-2xl border border-white/10 bg-white/5">
                  <AccordionTrigger className="px-6 py-5 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white/80">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <span className="text-white font-medium">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5">
                    <p className="text-white/60">{item.answer}</p>
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
