import Image from 'next/image';
import { Button } from './button';

interface PromptSuggestionsProps {
  append: (message: { role: 'user'; content: string }) => void;
  suggestions: string[];
}

export function PromptSuggestions({
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="flex max-w-md flex-col items-center justify-center gap-6">
      <Image alt="OpenCal" height={80} src="/open-cal.svg" width={80} />

      <div className="flex flex-col items-center gap-2">
        <h1 className="font-bold text-white text-xl">OpenCal Agent</h1>
        <p className="text-neutral-400 text-sm">
          Ask anything about your calendar
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-20 bg-gradient-to-r from-neutral-900 to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-20 bg-gradient-to-l from-neutral-900 to-transparent" />
        <div className="mb-3 flex gap-3 overflow-x-hidden">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <Button
              className="h-auto flex-shrink-0 cursor-pointer whitespace-nowrap rounded-sm border border-neutral-700 bg-neutral-900/50 p-2 text-left text-white transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-800/80"
              key={suggestion}
              onClick={() => append({ role: 'user', content: suggestion })}
              variant="outline"
            >
              <span className="text-sm text-white leading-relaxed">
                {suggestion}
              </span>
            </Button>
          ))}
        </div>

        <div className="flex gap-3 overflow-x-hidden">
          {suggestions.slice(3, 6).map((suggestion, index) => (
            <Button
              className="h-auto flex-shrink-0 whitespace-nowrap rounded-sm border border-neutral-700 bg-neutral-900/50 p-2 text-left text-white transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-800/80"
              key={suggestion}
              onClick={() => append({ role: 'user', content: suggestion })}
              variant="outline"
            >
              <span className="text-sm text-white leading-relaxed">
                {suggestion}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
