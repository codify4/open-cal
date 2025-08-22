import Providers from '@/providers/providers';

export const metadata = {
  title: 'Caly',
  description: 'An Open Source AI alternative to Google Calendar.',
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
