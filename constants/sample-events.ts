export interface DummyEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  color: string;
  type: 'event' | 'birthday';
  isAllDay: boolean;
  account?: string;
}

export const sampleEvents: DummyEvent[] = [
  {
    id: 'event-1',
    title: 'Team Meeting',
    description: 'Weekly team sync',
    startDate: new Date('2024-01-15T10:00:00'),
    endDate: new Date('2024-01-15T11:00:00'),
    color: 'blue',
    type: 'event',
    isAllDay: false,
    account: 'work@company.com',
  },
  {
    id: 'event-2',
    title: 'Lunch with Sarah',
    description: 'Catch up over lunch',
    startDate: new Date('2024-01-15T12:30:00'),
    endDate: new Date('2024-01-15T13:30:00'),
    color: 'green',
    type: 'event',
    isAllDay: false,
    account: 'personal@icloud.com',
  },
  {
    id: 'event-3',
    title: 'Project Review',
    description: 'Review Q1 progress',
    startDate: new Date('2024-01-15T14:00:00'),
    endDate: new Date('2024-01-15T15:30:00'),
    color: 'purple',
    type: 'event',
    isAllDay: false,
    account: 'work@company.com',
  },
  {
    id: 'event-4',
    title: 'John\'s Birthday',
    description: 'Team celebration',
    startDate: new Date('2024-01-16T09:00:00'),
    endDate: new Date('2024-01-16T09:00:00'),
    color: 'pink',
    type: 'birthday',
    isAllDay: true,
    account: 'work@company.com',
  },
]; 