"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { HelpCircle } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
}

interface UseCaseFAQProps {
  faq: FAQ[]
}

export function UseCaseFAQ({ faq }: UseCaseFAQProps) {
  return (
    <section className="relative py-32 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <HelpCircle className="w-3 h-3 mr-1" />
            {"FAQ"}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {"Frequently asked "}
            </span>
            <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
              {"questions"}
            </span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faq.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="group border-0"
              >
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                  <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <span className="text-lg font-semibold text-white pr-4">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-6">
                    <div className="pl-12">
                      <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                    </div>
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
