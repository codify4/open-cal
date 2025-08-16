import { useRef, useState } from 'react';
import type { Event } from '@/lib/store/calendar-store';
import { upsertGoogleEvent } from '@/lib/calendar-utils/google-calendar';

export const useMeetingGeneration = () => {
    const [isGeneratingMeeting, setIsGeneratingMeeting] = useState(false);
    const currentFormData = useRef<Partial<Event>>({});

    const updateFormData = (eventData: Partial<Event>) => {
        currentFormData.current = { ...currentFormData.current, ...eventData };
    };

    const generateMeeting = async (selectedEvent: Event | null, userId: string, userEmail?: string) => {
        if (isGeneratingMeeting || !selectedEvent) return;

        const hasGoogleMeet = selectedEvent.meetingType === 'google-meet' || currentFormData.current.meetingType === 'google-meet';
        if (!hasGoogleMeet) return;

        setIsGeneratingMeeting(true);
        try {
            const eventToSave = { ...selectedEvent, ...currentFormData.current };
            const result = await upsertGoogleEvent(eventToSave, userId, userEmail);
            return result;
        } finally {
            setIsGeneratingMeeting(false);
        }
    };

    return {
        isGeneratingMeeting,
        currentFormData: currentFormData.current,
        updateFormData,
        generateMeeting,
    };
};