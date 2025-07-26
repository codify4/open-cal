import { atom } from "jotai"

// Atom for the currently selected date in the calendar picker
export const selectedDateAtom = atom<Date | undefined>(undefined)

// Atom for the current view type (day, week, month)
export const viewTypeAtom = atom<"day" | "week" | "month">("week")

// Atom for the current date being displayed in the main calendar
export const currentDateAtom = atom<Date>(new Date())

// Derived atom to update current date when selected date changes
export const updateCurrentDateAtom = atom(
  (get) => get(currentDateAtom),
  (get, set, newDate: Date) => {
    set(currentDateAtom, newDate)
    set(selectedDateAtom, newDate)
  }
)
