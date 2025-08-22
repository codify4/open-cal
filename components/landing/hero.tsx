'use client';

import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Spotlight } from '../ui/spotlight';

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black"
      id="hero"
    >
      <Spotlight className="-top-0 left-0 md:top-24 md:left-60" fill="white" />
      <div className="container relative z-10 mx-auto mt-52 w-full px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col items-center justify-center gap-16 text-center">
          <motion.div
            className="space-y-8 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl text-white font-lora"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-bold font-lora text-5xl text-white tracking-tight md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              A calendar that
              <br />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                does everything for you
              </span>
            </motion.h1>

            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl text-base text-neutral-400 leading-relaxed sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Take control with Caly's AI-powered open source calendar. Sync
              with Google Calendar and let AI handle your events and time.
            </motion.p>

            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                asChild
                className="group rounded-full bg-white px-8 py-6 font-semibold text-black hover:bg-white/90"
                size="lg"
              >
                <Link href="/calendar" target="_blank">
                  Start for free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                className="group rounded-full border-white/20 bg-white/10 px-8 py-6 font-semibold hover:bg-white/10"
                size="lg"
                variant="outline"
              >
                <Link href="/github" target="_blank">
                  <Star
                    className="group-hover:-rotate-12 h-5 w-5 transition-transform duration-300"
                    color="yellow"
                    fill="yellow"
                  />
                  Give us a star
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <Image alt="Caly Hero" height={753} src="/ui-hero.png" width={1203} />
        </div>
      </div>
    </section>
  );
}
