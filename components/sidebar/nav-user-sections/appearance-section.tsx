'use client';

import { Moon, Settings, Sun } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme || 'system');

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="mb-2 font-semibold text-neutral-900 text-lg sm:text-xl dark:text-white">
          Appearance
        </h3>
        <p className="text-neutral-600 text-sm sm:text-base dark:text-neutral-400">
          Customize how the application looks and feels.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <CardHeader className="pb-4">
            <CardTitle className="text-neutral-900 text-base sm:text-lg dark:text-white">
              Theme
            </CardTitle>
            <CardDescription className="text-neutral-600 text-sm dark:text-neutral-400">
              Choose your preferred color scheme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <button
                  className={`cursor-pointer rounded-lg bg-white p-2 sm:p-3 transition-colors duration-100 w-full max-w-[200px] ${
                    selectedTheme === 'light'
                      ? 'border-2 border-neutral-500'
                      : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
                  }`}
                  onClick={() => handleThemeChange('light')}
                >
                  <Image
                    alt="Light Mode"
                    className="rounded-sm w-full h-auto"
                    height={245}
                    src="/light-mode.png"
                    width={425}
                  />
                </button>
                <span className="mt-2 text-black text-sm dark:text-white">
                  Light
                </span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  className={`cursor-pointer rounded-lg bg-neutral-900 p-2 sm:p-3 transition-colors duration-100 w-full max-w-[200px] ${
                    selectedTheme === 'dark'
                      ? 'border-2 border-neutral-500'
                      : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
                  }`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <Image
                    alt="Dark Mode"
                    className="rounded-sm w-full h-auto"
                    height={245}
                    src="/dark-mode.png"
                    width={425}
                  />
                </button>
                <span className="mt-2 text-black text-sm dark:text-white">
                  Dark
                </span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  className={`cursor-pointer rounded-lg p-2 sm:p-3 transition-colors duration-100 w-full max-w-[200px] ${
                    selectedTheme === 'system'
                      ? 'border-2 border-neutral-500'
                      : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600'
                  }`}
                  onClick={() => handleThemeChange('system')}
                >
                  <Image
                    alt="System Mode"
                    className="rounded-sm w-full h-auto"
                    height={245}
                    src="/dnl.png"
                    width={425}
                  />
                </button>
                <span className="mt-2 text-black text-sm dark:text-white">
                  System
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
