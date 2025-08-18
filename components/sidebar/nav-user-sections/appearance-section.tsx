'use client';

import { Moon, Settings, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme || 'system');

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white text-xl">Appearance</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Customize how the application looks and feels.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Theme</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Choose your preferred color scheme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                    <button
                        className={`bg-white cursor-pointer rounded-lg p-3 duration-100 transition-colors ${
                            selectedTheme === 'light'
                                ? 'border-2 border-neutral-500'
                                : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                            }`}
                        onClick={() => handleThemeChange('light')}
                    >
                        <Image src='/light-mode.png' alt='Light Mode' width={425} height={245} className='rounded-sm' />
                    </button>
                    <span className="text-sm text-black dark:text-white mt-2">Light</span>
                </div>

                <div className="flex flex-col items-center">
                    <button
                        className={`bg-neutral-900 cursor-pointer rounded-lg p-3 duration-100 transition-colors ${
                            selectedTheme === 'dark'
                                ? 'border-2 border-neutral-500'
                                : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                            }`}
                        onClick={() => handleThemeChange('dark')}
                    >
                        <Image src='/dark-mode.png' alt='Dark Mode' width={425} height={245} className='rounded-sm' />
                    </button>
                    <span className="text-sm text-black dark:text-white mt-2">Dark</span>
                </div>

                <div className="flex flex-col items-center">
                    <button
                        className={`cursor-pointer rounded-lg p-3 duration-100 transition-colors ${
                        selectedTheme === 'system'
                            ? 'border-2 border-neutral-500'
                            : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                        onClick={() => handleThemeChange('system')}
                    >
                        <Image src='/dnl.png' alt='System Mode' width={425} height={245} className='rounded-sm' />
                    </button>
                    <span className="text-sm text-black dark:text-white mt-2">System</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
