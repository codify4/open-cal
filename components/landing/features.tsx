'use client';

import {
  Bot,
  Brain,
  Calendar,
  CalendarCheck,
  Clock,
  Eye,
  GitBranch,
  Github,
  Shield,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { features } from '@/constants/features';

export function FeaturesSection({ page = false }: { page?: boolean }) {
  const VisualDemo = ({ type }: { type: string }) => {
    return (
      <div className="relative h-80 w-full overflow-hidden rounded-xl bg-black">
        <div className="group/card flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/70 p-8 transition-all duration-300 hover:border-neutral-700 hover:shadow-lg hover:shadow-neutral-900/30">
          {/* AI Calendar Agent */}
          {type === 'upload' && (
            <div className="flex w-full max-w-sm flex-col items-center rounded-lg border border-neutral-800 bg-neutral-900 p-6 shadow-lg transition-all duration-300 group-hover/card:scale-[1.02]">
              <div className="mb-4 flex items-start gap-3 self-start">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-neutral-200 transition-transform duration-300 group-hover/card:rotate-6" />
                  <span className="font-medium text-sm text-white">
                    AI Assistant
                  </span>
                  <div className="ml-auto h-2 w-2 bg-neutral-700 transition-colors duration-300 group-hover/card:bg-green-500" />
                </div>
                <div className="space-y-2">
                  <div className="text-neutral-400 text-xs">
                    Analyzing your schedule...
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                      <span className="text-neutral-300">
                        Checking availability
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-0 transition-opacity delay-100 duration-300 group-hover/card:opacity-100">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-neutral-300">
                        Found optimal time
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-0 transition-opacity delay-200 duration-300 group-hover/card:opacity-100">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span className="text-neutral-300">
                        Scheduling meeting
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-green-400 text-xs opacity-0 transition-opacity delay-300 duration-300 group-hover/card:opacity-100">
                  ✓ Meeting scheduled for 2:00 PM
                </div>
              </div>
            </div>
          )}
          {/* Google Calendar Integration */}
          {type === 'generate' && (
            <div className="flex w-full max-w-sm flex-col items-center rounded-lg border border-neutral-800 bg-neutral-900 p-6 shadow-lg transition-all duration-300 group-hover/card:scale-[1.02]">
              <div className="mb-4 flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-white transition-transform duration-300 group-hover/card:scale-110" />
                <span className="font-medium text-sm text-white">
                  Calendar Features
                </span>
              </div>
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="flex items-center gap-2 text-xs">
                    <Image
                      alt="Google Calendar"
                      height={20}
                      src="/g-cal.svg"
                      width={20}
                    />
                    Google Calendar
                  </span>
                  <span className="text-green-400 text-xs transition-colors duration-300 group-hover/card:text-green-400">
                    Connected
                  </span>
                </div>
                <div className="h-2 w-full rounded-sm bg-neutral-800" />
                <div className="h-2 w-3/4 rounded-sm bg-neutral-800" />
                <div className="opacity-0 transition-opacity delay-100 duration-300 group-hover/card:opacity-100">
                  <div className="mt-2 flex items-center gap-2 text-green-400 text-xs">
                    <Shield className="h-3 w-3" />
                    <span>Full calendar functionality</span>
                  </div>
                  <div className="mt-1 text-neutral-300 text-xs">
                    ✓ Events, reminders, tasks
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Smart Time Finding */}
          {type === 'edit' && <SmartTimeFindingAnimation />}
          {/* Open Source */}
          {type === 'publish' && (
            <div className="flex w-full max-w-sm flex-col items-center rounded-lg border border-neutral-800 bg-neutral-900 p-6 shadow-lg transition-all duration-300 group-hover/card:scale-[1.02]">
              <div className="mb-4 flex items-center gap-2">
                <Github className="h-5 w-5 text-white transition-transform duration-300 group-hover/card:scale-110" />
                <span className="font-medium text-sm text-white">
                  Open Source
                </span>
              </div>
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 text-xs">Repository</span>
                  <div className="flex items-center gap-2 text-neutral-500 transition-colors duration-300 group-hover/card:text-green-400">
                    <div className="h-2 w-2 bg-neutral-700 transition-colors duration-300 group-hover/card:bg-green-500" />
                    <span className="font-medium text-xs">Public</span>
                  </div>
                </div>
                <div className="translate-y-4 opacity-0 transition-all delay-100 duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                  <div className="mt-2 space-y-1 rounded-md border border-neutral-700 bg-neutral-800 p-3">
                    <div className="flex items-center gap-1 font-medium text-white text-xs">
                      <Star className="h-3 w-3 text-yellow-400" /> Free to use
                    </div>
                    <div className="flex items-center gap-1 font-medium text-white text-xs">
                      <GitBranch className="h-3 w-3 text-blue-400" /> Open
                      source
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="relative bg-black py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-20 text-center">
          <h2 className="mb-6 font-bold text-4xl text-white md:text-5xl">
            Features
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 text-xl">
            OpenCal is an open source AI calendar that helps you manage your
            schedule intelligently.
          </p>
        </div>
        {/* Features */}
        <div className="mx-auto max-w-5xl space-y-32">
          {features.map((feature, index) => (
            <div
              className={`flex ${page ? 'flex-col' : `flex-col lg:flex-row ${feature.reverse ? 'lg:flex-row-reverse' : ''}`} items-center gap-16 transition-transform duration-300`}
              key={feature.id}
            >
              {/* Visual */}
              <div className="w-full flex-1">
                <VisualDemo type={feature.visual} />
              </div>
              {/* Content */}
              <div className="flex-1 space-y-6">
                <h3 className="font-bold text-3xl text-white leading-tight md:text-4xl">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {page ? feature.longDescription : feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SmartTimeFindingAnimation() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex w-full max-w-sm flex-col items-center rounded-xl border border-neutral-800 bg-neutral-900 p-3 shadow-lg transition-all duration-300 group-hover/card:scale-[1.02]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mb-4 flex items-center gap-2">
        <Brain className="h-5 w-5 text-white transition-all duration-300" />
        <span className="font-medium text-sm text-white">
          Smart Time Finding
        </span>
      </div>
      <div className="w-full space-y-3">
        <div className="mb-2 text-neutral-500 text-xs">
          Finding best time for:
        </div>
        <div className="rounded-md border border-neutral-700 bg-neutral-800 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <span className="text-neutral-300 text-sm">Team Meeting</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Available times:</span>
            </div>
            <div className="space-y-1">
              {['9:00 AM', '2:00 PM', '4:00 PM'].map((time, i) => (
                <div
                  className={`flex items-center gap-2 rounded px-2 py-1 text-xs transition-all duration-300 ${
                    hovered && i === 1
                      ? 'border border-green-500/50 bg-green-500/20 text-green-400'
                      : i === 0
                        ? 'border border-blue-500/50 bg-blue-500/20 text-blue-400'
                        : i === 2
                          ? 'border border-purple-500/50 bg-purple-500/20 text-purple-400'
                          : 'border border-red-500/50 bg-red-700/20 text-red-400'
                  }`}
                  key={i}
                >
                  <div
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      hovered && i === 1
                        ? 'bg-green-500'
                        : i === 0
                          ? 'bg-blue-500'
                          : i === 2
                            ? 'bg-purple-500'
                            : 'bg-red-600'
                    }`}
                  />
                  <span>{time}</span>
                  <span
                    className={`ml-auto text-green-400 text-xs transition-all duration-300 ${
                      hovered && i === 1 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    ✓ Best
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            hovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          <Brain className="h-3 w-3 text-green-400" />
          <span className="text-green-400 text-xs">AI found optimal time</span>
        </div>
      </div>
    </div>
  );
}
