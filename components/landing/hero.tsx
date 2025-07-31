import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Spotlight } from '../ui/spotlight';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden lg:flex-row"
      id="hero"
    >
      <Spotlight className="-top-0 left-0 md:top-24 md:left-60" fill="white" />
      <div className="container relative z-10 mx-auto w-full px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="flex-1 space-y-6 lg:max-w-[45%] lg:space-y-8 xl:max-w-[50%]">
            <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-center lg:mt-24 lg:space-y-6 mb-10">
              <h1 className="w-full font-bold text-4xl leading-[1.1] tracking-tight lg:text-6xl xl:text-7xl">
                Never miss an event{' '}
                <span className="underline decoration-4 underline-offset-8">
                  ever again
                </span>
              </h1>

              <p className="max-w-2xl px-4 font-medium text-muted-foreground text-sm leading-relaxed sm:text-lg">
                Digit is an open-source AI calendar.
              </p>
              <Link href="/calendar">
                <Button className="group h-12 rounded-full" size="lg">
                  Join the beta
                  <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
          <Image src="/opencal-hero.png" alt="OpenCal Hero" width={1203} height={753} />
        </div>
      </div>
    </section>
  );
}
