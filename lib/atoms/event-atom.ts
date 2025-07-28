import { atom } from 'jotai'
import { Event } from '@/types'

// Event state atoms
export const isEventSidebarOpenAtom = atom(false)

export const selectedEventAtom = atom<Event | null>(null)

export const draggedEventAtom = atom<Event | null>(null)

// Event creation context
export const eventCreationContextAtom = atom<{
  clickPosition: { x: number, y: number } | null
  targetDate: Date | null
}>({
  clickPosition: null,
  targetDate: null
})

// Event colors
export const eventColorsAtom = atom([
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Purple', value: 'purple', hex: '#8B5CF6' },
  { name: 'Orange', value: 'orange', hex: '#F59E0B' },
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Pink', value: 'pink', hex: '#EC4899' },
  { name: 'Yellow', value: 'yellow', hex: '#FCD34D' },
  { name: 'Gray', value: 'gray', hex: '#6B7280' }
])

// Event types
export const eventTypesAtom = atom([
  { name: 'Event', value: 'event' },
  { name: 'Birthday', value: 'birthday' }
])