export function CalendarVisual() {
    return (
      <div className="relative aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl sm:rounded-3xl border border-white/10" />
        
        <div className="relative h-full p-6 sm:p-8 lg:p-12">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="h-6 sm:h-8 flex items-center justify-center">
                <span className="text-white/40 text-xs font-medium">{day}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const hasEvent = [6, 12, 18, 23].includes(i)
              const isToday = i === 15
              
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-md sm:rounded-lg flex items-center justify-center text-xs transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer ${
                    isToday
                      ? 'bg-white text-black font-medium shadow-lg shadow-white/20 scale-105'
                      : hasEvent
                      ? 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/15 hover:scale-105'
                      : 'text-white/40 hover:bg-white/5 hover:text-white/60 hover:scale-105'
                  }`}
                >
                  {i + 1}
                </div>
              )
            })}
          </div>
          
          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-white/20" />
              <span className="text-white/60 text-xs sm:text-sm">Team Meeting</span>
              <span className="text-white/40 text-xs ml-auto">2:00 PM</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-white/10" />
              <span className="text-white/60 text-xs sm:text-sm">Design Review</span>
              <span className="text-white/40 text-xs ml-auto">4:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    )
}