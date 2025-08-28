import { useEffect, useState, useRef } from 'react';
import type { Event } from '@/lib/store/calendar-store';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { EventAttendees } from './event-attendees';
import { EventAvailability } from './event-availability';
import { EventBasicInfo } from './event-basic-info';
import { EventDateTime } from './event-date-time';
import { EventLocation } from './event-location';
import { EventReminders } from './event-reminders';
import { EventRepeat } from './event-repeat';
import { EventSettings } from './event-settings';
import { EventVisibility } from './event-visibility';

interface GoogleContact {
  name: string;
  email: string;
}

interface EventFormProps {
  event?: Event | null;
  onSave?: (eventData: Partial<Event>) => void;
  onDataChange?: () => void;
  onGenerateMeeting?: () => void;
  isGeneratingMeeting?: boolean;
}

export const EventForm = ({
  event,
  onSave,
  onDataChange,
  onGenerateMeeting,
  isGeneratingMeeting,
}: EventFormProps) => {
  type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

  const sessionCalendars = useCalendarStore((state) => state.sessionCalendars);
  const hasSetDefaultCalendar = useRef(false);

  const formatTimeFromDate = (date: Date | string | undefined) => {
    if (!date) return '09:00';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return '09:00';
    }

    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
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
    meetingUrl: '',
    meetingCode: '',
    attendees: [] as GoogleContact[],
    reminders: [] as Date[],
    calendar: '',
    color: 'blue',
    isAllDay: false,
    timezone: 'UTC',
    repeat: 'none' as RepeatType,
    availability: 'busy',
    visibility: 'default',
  });

  useEffect(() => {
    if (event) {
      const newEventData = {
        ...eventData,
        title: event.title || '',
        description: event.description || '',
        startDate:
          event.startDate instanceof Date
            ? event.startDate
            : new Date(event.startDate),
        endDate:
          event.endDate instanceof Date
            ? event.endDate
            : new Date(event.endDate),
        startTime: formatTimeFromDate(event.startDate),
        endTime: formatTimeFromDate(event.endDate),
        location: event.location || '',
        attendees: event.attendees?.map(attendee => 
          typeof attendee === 'string' 
            ? { name: attendee, email: attendee }
            : attendee
        ) || [],
        reminders: [],
        calendar: event.calendar || event.account || '',
        color: event.color || 'blue',
        isAllDay: event.isAllDay ?? false,
        timezone: 'UTC',
        repeat: (event.repeat || 'none') as RepeatType,
        availability: 'busy',
        visibility: event.visibility || 'public',
        meetingType: event.meetingType || '',
        meetingUrl: event.meetLink || '',
        meetingCode: event.meetCode || '',
      };
      setEventData(newEventData);
      hasSetDefaultCalendar.current = false;
    } else if (!hasSetDefaultCalendar.current && Object.keys(sessionCalendars).length > 0) {
      // Set default calendar for new events only once
      const allCalendars: any[] = [];
      Object.values(sessionCalendars).forEach((sessionCals) => {
        if (Array.isArray(sessionCals)) {
          allCalendars.push(...sessionCals);
        }
      });
      
      const primaryCalendar = allCalendars.find((cal) => cal.primary) || allCalendars[0];
      const defaultCalendar = primaryCalendar?.id || '';
      
      if (defaultCalendar) {
        setEventData(prev => ({ ...prev, calendar: defaultCalendar }));
        hasSetDefaultCalendar.current = true;
      }
    }
  }, [event, sessionCalendars]);

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
        attendees: newData.attendees.map(contact => contact.email),
        reminders: [],
        color: newData.color,
        calendar: newData.calendar, // Store the calendar ID
        isAllDay: newData.isAllDay,
        repeat: newData.repeat as RepeatType,
        visibility: newData.visibility as 'public' | 'private',
        meetingType: (newData.meetingType as any) || 'none',
        meetLink: newData.meetingUrl || undefined,
        meetCode: newData.meetingCode || undefined,
        type: 'event' as const,
      };
      onSave(eventData);
    }
  };

  // Special handling for calendar changes to ensure immediate update
  const handleCalendarChange = (calendar: string) => {
    updateEventData({ calendar });
  };

  const handleRepeatChange = (repeat: string) => {
    updateEventData({ repeat: repeat as RepeatType });
  };

  const handleMeetingTypeChange = (newType: string) => {
    updateEventData({ meetingType: newType });
    if (newType !== 'google-meet') {
      updateEventData({ meetingUrl: '', meetingCode: '' });
    } else {
      setTimeout(() => {
        if (onGenerateMeeting) {
          onGenerateMeeting();
        }
      }, 100);
    }
  };

  const handleGenerateMeeting = () => {
    if (eventData.meetingType === 'google-meet' && onGenerateMeeting) {
      onGenerateMeeting();
    }
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
        isGeneratingMeeting={isGeneratingMeeting}
        meetingCode={eventData.meetingCode}
        meetingType={eventData.meetingType}
        meetingUrl={eventData.meetingUrl}
        onCalendarChange={handleCalendarChange}
        onColorChange={(color) => updateEventData({ color })}
        onGenerateMeeting={handleGenerateMeeting}
        onMeetingTypeChange={handleMeetingTypeChange}
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
