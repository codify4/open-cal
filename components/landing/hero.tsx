import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Spotlight } from '../ui/spotlight';

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden lg:flex-row"
      id="hero"
    >
      <Spotlight className="-top-0 left-0 md:top-24 md:left-60" fill="white" />
      <div className="container relative z-10 mx-auto w-full px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col items-center justify-center lg:flex-row">
          <div className="flex-1 space-y-6 lg:max-w-[45%] lg:space-y-8 xl:max-w-[50%]">
            <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-center lg:mt-24 lg:space-y-6">
              <h1 className="w-11/12 font-bold text-4xl leading-[1.1] tracking-tight lg:text-6xl xl:text-7xl">
                Never miss an event{' '}
                <span className="underline decoration-4 underline-offset-8">
                  ever again
                </span>
              </h1>

              <p className="max-w-2xl px-4 font-medium text-muted-foreground text-sm leading-relaxed sm:text-lg">
                Digit is an open-source AI calendar, offering a fresh
                alternative to traditional calendar applications.
              </p>
              <Link href="/calendar">
                <Button className="group h-12 rounded-full" size="lg">
                  Join the beta
                  <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="mx-4 flex h-64 w-full max-w-4xl justify-center rounded-lg bg-white sm:h-80 lg:h-96">
                image
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
