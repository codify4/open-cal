import { useState } from "react"
import { Button } from "../ui/button"
import { EventBasicInfo } from "./event-basic-info"
import { EventDateTime } from "./event-date-time"
import { EventLocation } from "./event-location"
import { EventAttendees } from "./event-attendees"
import { EventReminders } from "./event-reminders"
import { EventSettings } from "./event-settings"

interface EventFormProps {
    onClose: () => void
}

export const EventForm = () => {
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
        color: ""
    })

    const handleSubmit = () => {
        console.log("Event data:", eventData)
    }

    return (
        <div className="space-y-4">
            <EventBasicInfo 
                title={eventData.title}
                description={eventData.description}
                onTitleChange={(title) => setEventData(prev => ({ ...prev, title }))}
                onDescriptionChange={(description) => setEventData(prev => ({ ...prev, description }))}
            />

            <EventDateTime 
                startDate={eventData.startDate}
                endDate={eventData.endDate}
                startTime={eventData.startTime}
                endTime={eventData.endTime}
                onStartDateChange={(date) => setEventData(prev => ({ ...prev, startDate: date }))}
                onEndDateChange={(date) => setEventData(prev => ({ ...prev, endDate: date }))}
                onStartTimeChange={(time) => setEventData(prev => ({ ...prev, startTime: time }))}
                onEndTimeChange={(time) => setEventData(prev => ({ ...prev, endTime: time }))}
            />

            <div className="flex flex-col gap-2">
                <EventLocation 
                    location={eventData.location}
                    onLocationChange={(location) => setEventData(prev => ({ ...prev, location }))}
                />

                <EventAttendees 
                    attendees={eventData.attendees}
                    onAttendeesChange={(attendees) => setEventData(prev => ({ ...prev, attendees }))}
                />

                <EventReminders 
                    reminders={eventData.reminders}
                    onRemindersChange={(reminders) => setEventData(prev => ({ ...prev, reminders }))}
                />
            </div>

            <EventSettings 
                meetingType={eventData.meetingType}
                calendar={eventData.calendar}
                color={eventData.color}
                onMeetingTypeChange={(meetingType) => setEventData(prev => ({ ...prev, meetingType }))}
                onCalendarChange={(calendar) => setEventData(prev => ({ ...prev, calendar }))}
                onColorChange={(color) => setEventData(prev => ({ ...prev, color }))}
            />

            <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" onClick={handleSubmit}>Create Event</Button>
            </div>
        </div>
    )
} 