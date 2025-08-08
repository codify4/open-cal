"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
    {
        question: "How does Caly's AI help me manage my calendar?",
        answer:
        "Caly's AI assistant understands natural language and can schedule meetings, set reminders, and organize your calendar through simple conversations. Just tell it what you need, and it handles the rest.",
    },
    {
        question: "Can Caly integrate with my existing calendar apps?",
        answer:
        "Yes! Caly seamlessly integrates with Google Calendar, Outlook, Apple Calendar, and other popular calendar services. Your events sync automatically across all your devices.",
    },
    {
        question: "How does Caly handle scheduling conflicts?",
        answer:
        "Our AI intelligently detects scheduling conflicts and suggests alternative times. It can also automatically find the best meeting times for multiple attendees based on everyone's availability.",
    },
    {
        question: "Is my calendar data secure and private?",
        answer:
        "Absolutely. Caly uses enterprise-grade encryption and follows strict privacy standards. Your calendar data is never shared with third parties, and you have full control over your information.",
    },
    {
        question: "Can Caly learn my scheduling preferences?",
        answer:
        "Yes! The AI learns your scheduling patterns, preferred meeting times, and work habits over time. It gets smarter with each interaction, making scheduling more personalized and efficient.",
    },
    {
        question: "What makes Caly different from other calendar apps?",
        answer:
        "Caly combines the power of AI with intuitive design. Unlike traditional calendar apps, you can simply chat with Caly to schedule, reschedule, or manage events. It's like having a personal assistant for your calendar.",
    },
]

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

  return (
        <section id="faq" className="py-32 flex flex-col items-center justify-center bg-black">
            <div className="container mx-auto px-6 lg:px-8 flex flex-col items-center justify-center">
                <div className="max-w-3xl mb-20 text-center">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-white">Frequently asked questions</h2>
                <p className="text-xl text-neutral-400 leading-relaxed font-medium">
                    Everything you need to know about Caly. Can&apos;t find what you&apos;re looking for?
                </p>
                </div>

                <Accordion type="single" collapsible defaultValue="item-0" className="max-w-3xl w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium text-lg cursor-pointer text-white hover:text-neutral-300">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-neutral-400 leading-relaxed">{faq.answer}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}