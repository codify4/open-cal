'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "How does OpenCal's AI help me manage my calendar?",
    answer:
      "OpenCal's AI assistant understands natural language and can schedule meetings, set reminders, and organize your calendar through simple conversations. Just tell it what you need, and it handles the rest.",
  },
  {
    question: 'Can OpenCal integrate with my existing calendar apps?',
    answer:
      'Yes! OpenCal seamlessly integrates with Google Calendar, Outlook, Apple Calendar, and other popular calendar services. Your events sync automatically across all your devices.',
  },
  {
    question: 'How does OpenCal handle scheduling conflicts?',
    answer:
      "Our AI intelligently detects scheduling conflicts and suggests alternative times. It can also automatically find the best meeting times for multiple attendees based on everyone's availability.",
  },
  {
    question: 'Is my calendar data secure and private?',
    answer:
      'Absolutely. OpenCal uses enterprise-grade encryption and follows strict privacy standards. Your calendar data is never shared with third parties, and you have full control over your information.',
  },
  {
    question: 'Can OpenCal learn my scheduling preferences?',
    answer:
      'Yes! The AI learns your scheduling patterns, preferred meeting times, and work habits over time. It gets smarter with each interaction, making scheduling more personalized and efficient.',
  },
  {
    question: 'What makes OpenCal different from other calendar apps?',
    answer:
      "OpenCal combines the power of AI with intuitive design. Unlike traditional calendar apps, you can simply chat with OpenCal to schedule, reschedule, or manage events. It's like having a personal assistant for your calendar.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="flex flex-col items-center justify-center bg-black py-32"
      id="faq"
    >
      <div className="container mx-auto flex flex-col items-center justify-center px-6 lg:px-8">
        <div className="mb-20 max-w-3xl text-center">
          <h2 className="mb-6 font-bold text-4xl text-white tracking-tight lg:text-5xl">
            Frequently asked questions
          </h2>
          <p className="font-medium text-neutral-400 text-xl leading-relaxed">
            Everything you need to know about OpenCal. Can&apos;t find what
            you&apos;re looking for?
          </p>
        </div>

        <Accordion
          className="w-full max-w-3xl"
          collapsible
          defaultValue="item-0"
          type="single"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="cursor-pointer text-left font-medium text-lg text-white hover:text-neutral-300">
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
  );
}
