import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface UseCaseTestimonialsProps {
  testimonials: Testimonial[];
}

export function UseCaseTestimonials({ testimonials }: UseCaseTestimonialsProps) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary">Testimonials</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            Loved by teams worldwide
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative border border-border/60 shadow-lg bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-2xl">
              <ShineBorder className="rounded-2xl" duration={14} shineColor={["#ffffff0a","#9999990a","#ffffff0a"]} />
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Quote className="h-8 w-8 text-primary/50" aria-hidden="true" />
                  <blockquote className="text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`/api/avatar/${testimonial.author}`} />
                      <AvatarFallback>
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 