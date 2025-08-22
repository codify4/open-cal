import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/actions/access-token';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate, excludeEventId } = await request.json();
    
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }

    const calendarId = 'primary';
    const timeMin = new Date(startDate).toISOString();
    const timeMax = new Date(endDate).toISOString();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: response.status });
    }

    const data = await response.json();
    const events = data.items || [];

    // Filter out excluded event if specified
    const filteredEvents = excludeEventId 
      ? events.filter((event: any) => event.id !== excludeEventId)
      : events;

    // Check for conflicts
    const conflictingEvents = filteredEvents.filter((event: any) => {
      const eventStart = new Date(event.start?.dateTime || event.start?.date);
      const eventEnd = new Date(event.end?.dateTime || event.end?.date);
      
      const requestStart = new Date(startDate);
      const requestEnd = new Date(endDate);
      
      return eventStart < requestEnd && eventEnd > requestStart;
    });

    const hasConflicts = conflictingEvents.length > 0;

    return NextResponse.json({
      success: true,
      hasConflicts,
      events: conflictingEvents,
      totalEvents: events.length,
    });
  } catch (error) {
    console.error('Error checking conflicts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
