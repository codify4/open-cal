import { useEffect, useState } from 'react';
import { getAccessTokenForSession } from '@/actions/access-token';
import { useCalendarStore } from '@/providers/calendar-store-provider';

interface GoogleContact {
  name: string;
  email: string;
}

export const useGoogleContacts = () => {
  const sessionCalendars = useCalendarStore((state) => state.sessionCalendars);
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      
      if (!sessionCalendars || Object.keys(sessionCalendars).length === 0) {
        return;
      }
      
      setLoading(true);
      const allContacts: GoogleContact[] = [];
      
      try {
        // Process each session like event-settings.tsx does
        for (const [sessionId, sessionCals] of Object.entries(sessionCalendars)) {
          if (!Array.isArray(sessionCals) || sessionCals.length === 0) continue;
          
          const token = await getAccessTokenForSession(sessionId);
          if (!token) {
            continue;
          }
          
          const response = await fetch(
            `https://people.googleapis.com/v1/otherContacts?readMask=names,emailAddresses`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          
          if (response.ok) {
            const data = await response.json();
            
            if (data.otherContacts && data.otherContacts.length > 0) {
              
              data.otherContacts.forEach((person: any, index: number) => {
                
                const name = person.names?.[0]?.displayName || 'Unknown';
                const email = person.emailAddresses?.[0]?.value;
                
                if (email && !allContacts.some(contact => contact.email === email)) {
                  allContacts.push({ name, email });
                }
              });
            }
          } else {
            const errorText = await response.text();
            console.error('useGoogleContacts: Error response for session:', errorText);
          }
        }
        
        setContacts(allContacts);
        
      } catch (error) {
        console.error('useGoogleContacts: Failed to fetch contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [sessionCalendars]);

  return { contacts, loading };
};
