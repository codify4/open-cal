import { useState, useEffect } from "react"
import { EventBasicInfo } from "./event-basic-info"
import { EventDateTime } from "./event-date-time"
import { EventLocation } from "./event-location"
import { EventAttendees } from "./event-attendees"
import { EventReminders } from "./event-reminders"
import { EventSettings } from "./event-settings"
import { EventRepeat } from "./event-repeat"
import { EventAvailability } from "./event-availability"
import { EventVisibility } from "./event-visibility"
import { Event } from "@/lib/store/calendar-store"

interface EventFormProps {
  event?: Event | null
  onSave?: (eventData: Partial<Event>) => void
  onDataChange?: () => void
}

export const EventForm = ({ event, onSave, onDataChange }: EventFormProps) => {
    type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
    
    const formatTimeFromDate = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    }

    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        startTime: "09:00",
        endTime: "10:00",
        location: "",
        meetingType: "",
        attendees: [] as string[],
        reminders: [] as Date[],
        calendar: "",
        color: "blue",
        isAllDay: false,
        timezone: "UTC",
        repeat: "none" as RepeatType,
        availability: "busy",
        visibility: "default",
    })

    // Initialize form data when editing an event or when event changes
    useEffect(() => {
        if (event) {
            setEventData({
                title: event.title || "",
                description: event.description || "",
                startDate: event.startDate,
                endDate: event.endDate,
                startTime: formatTimeFromDate(event.startDate),
                endTime: formatTimeFromDate(event.endDate),
                location: event.location || "",
                meetingType: "",
                attendees: event.attendees || [],
                reminders: [], // Convert Date[] to string[] or use empty array
                calendar: "",
                color: event.color || "blue",
                isAllDay: event.isAllDay || false,
                timezone: "UTC",
                repeat: (event.repeat || "none") as RepeatType,
                availability: "busy", // Default since Event type doesn't have availability
                visibility: event.visibility || "public",
            })
        }
    }, [event])

    // Auto-save functionality
    const updateEventData = (updates: Partial<typeof eventData>) => {
        const newData = { ...eventData, ...updates }
        setEventData(newData)
        
        if (onSave) {
            const convertTimeToDate = (date: Date, timeString: string) => {
                const [hours, minutes] = timeString.split(':').map(Number)
                const newDate = new Date(date)
                newDate.setHours(hours, minutes, 0, 0)
                return newDate
            }
            
            const eventData: Partial<Event> = {
                title: newData.title,
                description: newData.description,
                startDate: convertTimeToDate(newData.startDate, newData.startTime),
                endDate: convertTimeToDate(newData.endDate, newData.endTime),
                location: newData.location,
                attendees: newData.attendees,
                reminders: [],
                color: newData.color,
                isAllDay: newData.isAllDay,
                repeat: newData.repeat as RepeatType,
                visibility: newData.visibility as 'public' | 'private',
                type: 'event' as const
            }
            onSave(eventData)
        }
    }

    const handleRepeatChange = (repeat: string) => {
        updateEventData({ repeat: repeat as RepeatType })
    }

    return (
        <div className="space-y-4">
            <EventBasicInfo 
                title={eventData.title}
                description={eventData.description}
                onTitleChange={(title) => updateEventData({ title })}
                onDescriptionChange={(description) => updateEventData({ description })}
            />

            <EventDateTime 
                startDate={eventData.startDate}
                endDate={eventData.endDate}
                startTime={eventData.startTime}
                endTime={eventData.endTime}
                isAllDay={eventData.isAllDay}
                timezone={eventData.timezone}
                onStartDateChange={(date) => updateEventData({ startDate: date })}
                onEndDateChange={(date) => updateEventData({ endDate: date })}
                onStartTimeChange={(time) => updateEventData({ startTime: time })}
                onEndTimeChange={(time) => updateEventData({ endTime: time })}
                onAllDayChange={(isAllDay) => updateEventData({ isAllDay })}
                onTimezoneChange={(timezone) => updateEventData({ timezone })}
            />

            <EventRepeat 
                repeat={eventData.repeat}
                onRepeatChange={handleRepeatChange}
            />

            <div className="flex flex-col gap-2">
                <EventLocation 
                    location={eventData.location}
                    onLocationChange={(location) => updateEventData({ location })}
                />

                <EventAttendees 
                    attendees={eventData.attendees}
                    onAttendeesChange={(attendees) => updateEventData({ attendees })}
                />

                <EventReminders 
                    reminders={eventData.reminders}
                    onRemindersChange={(reminders) => updateEventData({ reminders })}
                />
            </div>

            <EventSettings 
                meetingType={eventData.meetingType}
                calendar={eventData.calendar}
                color={eventData.color}
                onMeetingTypeChange={(meetingType) => updateEventData({ meetingType })}
                onCalendarChange={(calendar) => updateEventData({ calendar })}
                onColorChange={(color) => updateEventData({ color })}
            />

           <div className="flex flex-col gap-2">
                <EventAvailability 
                    availability={eventData.availability}
                    onAvailabilityChange={(availability) => updateEventData({ availability })}
                />

                <EventVisibility 
                    visibility={eventData.visibility}
                    onVisibilityChange={(visibility) => updateEventData({ visibility })}
                />
           </div>
        </div>
    )
} 