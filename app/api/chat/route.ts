import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  smoothStream,
  streamText,
  type UIMessage,
} from 'ai';
import { generateCalendarAgentSystemPrompt } from '@/lib/calendar-agent/system-prompt';
import { calendarTools } from '@/lib/calendar-agent/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response('Google API key not configured', { status: 500 });
  }

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: generateCalendarAgentSystemPrompt(),
    messages: [...convertToModelMessages(messages)],
    tools: calendarTools,
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: 'word',
    }),
  });

  return result.toUIMessageStreamResponse();
}
