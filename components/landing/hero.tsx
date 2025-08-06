'use client'

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Spotlight } from '../ui/spotlight';
import Image from 'next/image';
import { motion } from 'motion/react';

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black"
      id="hero"
    >
      <Spotlight className="-top-0 left-0 md:top-24 md:left-60" fill="white" />
      <div className="container relative z-10 mx-auto w-full mt-52 px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col items-center justify-center gap-16 text-center">
          <motion.div
            className="space-y-8 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              A calendar that
              <br />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                does everything for you
              </span>
            </motion.h1>
            
            <motion.p
              className="text-base sm:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Take control with OpenCal's AI-powered open source calendar. Sync with Google Calendar and let AI handle your events and time.
            </motion.p>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button asChild size="lg" className="group px-8 py-6 rounded-full font-semibold bg-white text-black hover:bg-white/90">
                <Link href="/calendar">
                  Join the beta
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <Image src="/hero-ui.png" alt="OpenCal Hero" width={1203} height={753} />
        </div>
      </div>
    </section>
  );
}
