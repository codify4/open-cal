import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface FAQ {
  question: string;
  answer: string;
}

interface UseCaseFAQProps {
  faq: FAQ[];
}

export function UseCaseFAQ({ faq }: UseCaseFAQProps) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 space-y-4 text-center">
          <Badge variant="secondary">FAQ</Badge>
          <h2 className="font-bold text-3xl lg:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion className="space-y-4" collapsible type="single">
            {faq.map((item, index) => (
              <AccordionItem
                className="rounded-lg border"
                key={index}
                value={`item-${index}`}
              >
                <AccordionTrigger className="px-6 py-4 text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
