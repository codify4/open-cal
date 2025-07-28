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
import { Event } from "@/types"

interface EventFormProps {
  event?: Event | null
  onSave?: (eventData: Partial<Event>) => void
  onDataChange?: () => void
}

export const EventForm = ({ event, onSave, onDataChange }: EventFormProps) => {
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
        reminders: [] as string[],
        calendar: "",
        color: "blue",
        isAllDay: false,
        timezone: "UTC",
        repeat: "none",
        availability: "busy",
        visibility: "default",
    })

    // Initialize form data when editing an event
    useEffect(() => {
        if (event) {
            setEventData({
                title: event.title || "",
                description: event.description || "",
                startDate: event.startDate,
                endDate: event.endDate,
                startTime: event.startTime || "09:00",
                endTime: event.endTime || "10:00",
                location: event.location || "",
                meetingType: "",
                attendees: event.attendees || [],
                reminders: event.reminders || [],
                calendar: "",
                color: event.color || "blue",
                isAllDay: event.isAllDay,
                timezone: "UTC",
                repeat: event.repeat || "none",
                availability: event.availability || "busy",
                visibility: event.visibility || "default",
            })
        }
    }, [event])

    // Auto-save functionality
    const updateEventData = (updates: Partial<typeof eventData>) => {
        const newData = { ...eventData, ...updates }
        setEventData(newData)
        
        // Trigger auto-save
        if (onSave) {
            onSave(newData)
        }
        
        // Notify parent of data change
        if (onDataChange) {
            onDataChange()
        }
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
                onRepeatChange={(repeat) => updateEventData({ repeat })}
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