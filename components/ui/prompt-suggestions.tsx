import { ChevronRight } from "lucide-react";
import { Button } from "./button";

interface PromptSuggestionsProps {
  append: (message: { role: "user"; content: string }) => void
  suggestions: string[]
}

export function PromptSuggestions({
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 max-w-md">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-black rounded-sm"></div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold text-white">
          Digit Calendar Agent
        </h1>
        <p className="text-neutral-400 text-sm">
          Ask anything about your calendar
        </p>
      </div>

      <div className="flex flex-col items-center relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-neutral-900 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-neutral-900 to-transparent pointer-events-none z-10" />
        <div className="flex gap-3 overflow-x-hidden mb-3">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <Button
              key={suggestion}
              onClick={() => append({ role: "user", content: suggestion })}
              variant="outline"
              className="text-left rounded-sm p-2 border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-neutral-600 transition-all duration-200 cursor-pointer text-white h-auto whitespace-nowrap flex-shrink-0"
            >
              <span className="text-white text-sm leading-relaxed">{suggestion}</span>
            </Button>
          ))}
        </div>
        
        <div className="flex gap-3 overflow-x-hidden">
          {suggestions.slice(3, 6).map((suggestion, index) => (
            <Button
              key={suggestion}
              onClick={() => append({ role: "user", content: suggestion })}
              variant="outline"
              className="text-left rounded-sm p-2 border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-neutral-600 transition-all duration-200 text-white h-auto whitespace-nowrap flex-shrink-0"
            >
              <span className="text-white text-sm leading-relaxed">{suggestion}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
