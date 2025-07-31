import { useEffect, useState } from 'react';
import type { Event } from '@/lib/store/calendar-store';
import { EventAttendees } from './event-attendees';
import { EventAvailability } from './event-availability';
import { EventBasicInfo } from './event-basic-info';
import { EventDateTime } from './event-date-time';
import { EventLocation } from './event-location';
import { EventReminders } from './event-reminders';
import { EventRepeat } from './event-repeat';
import { EventSettings } from './event-settings';
import { EventVisibility } from './event-visibility';

interface EventFormProps {
  event?: Event | null;
  onSave?: (eventData: Partial<Event>) => void;
  onDataChange?: () => void;
}

export const EventForm = ({ event, onSave, onDataChange }: EventFormProps) => {
  type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

  const formatTimeFromDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    meetingType: '',
    attendees: [] as string[],
    reminders: [] as Date[],
    calendar: '',
    color: 'blue',
    isAllDay: false,
    timezone: 'UTC',
    repeat: 'none' as RepeatType,
    availability: 'busy',
    visibility: 'default',
  });

  // Initialize form data when editing an event or when event changes
  useEffect(() => {
    if (event) {
      setEventData({
        title: event.title || '',
        description: event.description || '',
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: formatTimeFromDate(event.startDate),
        endTime: formatTimeFromDate(event.endDate),
        location: event.location || '',
        meetingType: '',
        attendees: event.attendees || [],
        reminders: [], // Convert Date[] to string[] or use empty array
        calendar: event.account || '',
        color: event.color || 'blue',
        isAllDay: event.isAllDay,
        timezone: 'UTC',
        repeat: (event.repeat || 'none') as RepeatType,
        availability: 'busy', // Default since Event type doesn't have availability
        visibility: event.visibility || 'public',
      });
    }
  }, [event]);

  // Auto-save functionality
  const updateEventData = (updates: Partial<typeof eventData>) => {
    const newData = { ...eventData, ...updates };
    setEventData(newData);

    if (onSave) {
      const convertTimeToDate = (date: Date, timeString: string) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
      };

      const eventData: Partial<Event> = {
        title: newData.title,
        description: newData.description,
        startDate: convertTimeToDate(newData.startDate, newData.startTime),
        endDate: convertTimeToDate(newData.endDate, newData.endTime),
        location: newData.location,
        attendees: newData.attendees,
        reminders: [],
        color: newData.color,
        account: newData.calendar,
        isAllDay: newData.isAllDay,
        repeat: newData.repeat as RepeatType,
        visibility: newData.visibility as 'public' | 'private',
        type: 'event' as const,
      };
      onSave(eventData);
    }
  };

  const handleRepeatChange = (repeat: string) => {
    updateEventData({ repeat: repeat as RepeatType });
  };

  return (
    <div className="space-y-4">
      <EventBasicInfo
        description={eventData.description}
        onDescriptionChange={(description) => updateEventData({ description })}
        onTitleChange={(title) => updateEventData({ title })}
        title={eventData.title}
      />

      <EventDateTime
        endDate={eventData.endDate}
        endTime={eventData.endTime}
        isAllDay={eventData.isAllDay}
        onAllDayChange={(isAllDay) => updateEventData({ isAllDay })}
        onEndDateChange={(date) => updateEventData({ endDate: date })}
        onEndTimeChange={(time) => updateEventData({ endTime: time })}
        onStartDateChange={(date) => updateEventData({ startDate: date })}
        onStartTimeChange={(time) => updateEventData({ startTime: time })}
        onTimezoneChange={(timezone) => updateEventData({ timezone })}
        startDate={eventData.startDate}
        startTime={eventData.startTime}
        timezone={eventData.timezone}
      />

      <EventRepeat
        onRepeatChange={handleRepeatChange}
        repeat={eventData.repeat}
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
          onRemindersChange={(reminders) => updateEventData({ reminders })}
          reminders={eventData.reminders}
        />
      </div>

      <EventSettings
        calendar={eventData.calendar}
        color={eventData.color}
        meetingType={eventData.meetingType}
        onCalendarChange={(calendar) => updateEventData({ calendar })}
        onColorChange={(color) => updateEventData({ color })}
        onMeetingTypeChange={(meetingType) => updateEventData({ meetingType })}
      />

      <div className="flex flex-col gap-2">
        <EventAvailability
          availability={eventData.availability}
          onAvailabilityChange={(availability) =>
            updateEventData({ availability })
          }
        />

        <EventVisibility
          onVisibilityChange={(visibility) => updateEventData({ visibility })}
          visibility={eventData.visibility}
        />
      </div>
    </div>
  );
};
