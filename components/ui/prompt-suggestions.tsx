import { ChevronRight } from "lucide-react";

interface PromptSuggestionsProps {
  append: (message: { role: "user"; content: string }) => void
  suggestions: string[]
}

export function PromptSuggestions({
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="space-y-8">
      <div className="text-start ml-2">
        <p className="text-base bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
          Choose a suggestion to get started
        </p>
      </div>
      
      <div className="grid gap-3">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion}
            onClick={() => append({ role: "user", content: suggestion })}
            className="group relative w-full text-left p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-neutral-700 transition-all duration-200 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neutral-500/10 to-neutral-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white text-sm leading-relaxed group-hover:text-neutral-100 transition-colors">
                    {suggestion}
                  </p>
                </div>
                
                <ChevronRight size={16} className=""/>
              </div>
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ))}
      </div>
    </div>
  )
}
