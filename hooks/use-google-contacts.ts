import { useEffect, useState } from 'react';
import { getAccessTokenForSession } from '@/actions/access-token';

interface GoogleContact {
  name: string;
  email: string;
}

export const useGoogleContacts = (sessionId?: string) => {
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!sessionId) return;
      
      const token = await getAccessTokenForSession(sessionId);
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses&pageSize=1000`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const contactList: GoogleContact[] = [];
          
          data.connections?.forEach((person: any) => {
            const name = person.names?.[0]?.displayName || 'Unknown';
            const email = person.emailAddresses?.[0]?.value;
            
            if (email) {
              contactList.push({ name, email });
            }
          });
          
          setContacts(contactList);
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [sessionId]);

  return { contacts, loading };
};
