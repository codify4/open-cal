import { Quote } from 'lucide-react';
import { ShineBorder } from '@/components/magicui/shine-border';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface UseCaseTestimonialsProps {
  testimonials: Testimonial[];
}

export function UseCaseTestimonials({
  testimonials,
}: UseCaseTestimonialsProps) {
  return (
    <section className="bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 space-y-4 text-center">
          <Badge variant="secondary">Testimonials</Badge>
          <h2 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text font-bold text-3xl text-transparent lg:text-4xl">
            Loved by teams worldwide
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Card
              className="relative rounded-2xl border border-border/60 bg-gradient-to-br from-neutral-950 to-neutral-900 shadow-lg"
              key={index}
            >
              <ShineBorder
                className="rounded-2xl"
                duration={14}
                shineColor={['#ffffff0a', '#9999990a', '#ffffff0a']}
              />
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Quote
                    aria-hidden="true"
                    className="h-8 w-8 text-primary/50"
                  />
                  <blockquote className="text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`/api/avatar/${testimonial.author}`} />
                      <AvatarFallback>
                        {testimonial.author
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-muted-foreground text-sm">
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
