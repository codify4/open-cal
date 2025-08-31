'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Github } from 'lucide-react'
import Link from 'next/link'

export function OpenSourceVisual() {
    const [codeLineIndex, setCodeLineIndex] = useState(0)
    
    const codeLines = [
      "git clone github.com/caly/caly",
      "pnpm dev",
      "// Free to customize",
      "// MIT Licensed"
    ]
    
    useEffect(() => {
      const interval = setInterval(() => {
        setCodeLineIndex((prev) => (prev + 1) % codeLines.length)
      }, 2000)
      return () => clearInterval(interval)
    }, [])
    
    return (
      <div className="relative aspect-square max-w-lg mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10" />
        
        <div className="relative h-full p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
              <Github className="w-8 h-8 text-white/80" />
            </div>
            <h4 className="text-white/80 text-lg font-medium">Open Source</h4>
          </div>
          
          <div className="space-y-6">
            <div className="bg-black/40 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-white/40 text-xs ml-2">terminal</span>
              </div>
              <div className="font-mono text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400">$</span>
                  <span className="text-white/80 transition-all duration-500 ease-in-out">
                    {codeLines[codeLineIndex]}
                  </span>
                  <div className="w-2 h-4 bg-white/60 animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-white/60">MIT License</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-white/60">Self-hostable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-white/60">Customizable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-white/60">Free forever</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/github" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer">
                <span className="text-white/80 text-sm">View on GitHub</span>
                <ArrowRight className="w-3 h-3 text-white/60 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }