"use client"

import { createContext, type ReactNode } from "react"
import { useStore } from "zustand"
import { CalendarStoreContext } from "@/providers/calendar-store-provider"
import type { CalendarState } from "@/lib/store/calendar-store"
import { createCalendarStore } from "@/lib/store/calendar-store"

export type DemoCalendarStoreApi = ReturnType<typeof createCalendarStore>

export function DemoCalendarStoreProvider({ children, initState }: { children: ReactNode; initState: CalendarState }) {
  const store = createCalendarStore(initState)
  return <CalendarStoreContext.Provider value={store}>{children}</CalendarStoreContext.Provider>
}

export const useDemoCalendarStore = <T,>(selector: (store: any) => T): T => {
  const calendarStoreContext = (CalendarStoreContext as unknown as React.Context<any>).current
  if (!calendarStoreContext) {
    throw new Error("useDemoCalendarStore must be used within DemoCalendarStoreProvider")
  }
  return useStore(calendarStoreContext, selector)
}


