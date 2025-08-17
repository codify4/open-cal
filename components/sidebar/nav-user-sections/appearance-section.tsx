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
              <button
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedTheme === 'light'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
                onClick={() => handleThemeChange('light')}
              >
                <div className="mb-2 flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <span className="font-medium text-neutral-900 dark:text-white">Light</span>
                </div>
                <div className="h-8 rounded border-2 border-gray-200 bg-white" />
              </button>

              <button
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedTheme === 'dark'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className="mb-2 flex items-center space-x-2">
                  <Moon className="h-4 w-4" />
                  <span className="font-medium text-neutral-900 dark:text-white">Dark</span>
                </div>
                <div className="h-8 rounded border-2 border-neutral-700 bg-neutral-900" />
              </button>

              <button
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedTheme === 'system'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
                onClick={() => handleThemeChange('system')}
              >
                <div className="mb-2 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium text-neutral-900 dark:text-white">System</span>
                </div>
                <div className="h-8 rounded border-2 border-gray-200 bg-gradient-to-r from-white to-neutral-900" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
