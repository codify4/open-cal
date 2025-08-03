'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { testCalendarTools } from '@/lib/calendar-agent/test-tools';

export function CalendarAgentTest() {
  const { events, pendingActions, addPendingAction, clearPendingActions } = useCalendarStore((state) => state);

  const handleTestTools = async () => {
    console.log('Testing calendar tools...');
    await testCalendarTools();
  };

  const handleAddTestAction = () => {
    addPendingAction({
      toolName: 'create_event',
      args: {
        title: 'Test Event',
        startDate: '2024-01-16T14:00:00Z',
        endDate: '2024-01-16T15:00:00Z',
      },
      result: {
        success: true,
        event: {
          id: 'test-event-123',
          title: 'Test Event',
          startDate: new Date('2024-01-16T14:00:00Z'),
          endDate: new Date('2024-01-16T15:00:00Z'),
          color: 'blue',
          type: 'event',
        },
      },
      status: 'pending',
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Calendar Agent Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={handleTestTools} className="w-full">
            Test Calendar Tools
          </Button>
          <Button onClick={handleAddTestAction} variant="outline" className="w-full">
            Add Test Action
          </Button>
          <Button onClick={clearPendingActions} variant="outline" className="w-full">
            Clear Pending Actions
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Current Events: {events.length}</h3>
          <h3 className="font-medium">Pending Actions: {pendingActions.length}</h3>
          
          {pendingActions.length > 0 && (
            <div className="space-y-1">
              {pendingActions.map((action) => (
                <div key={action.id} className="text-sm p-2 bg-gray-100 rounded">
                  <div className="font-medium">{action.toolName}</div>
                  <div className="text-xs text-gray-600">
                    Status: {action.status} • {action.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 