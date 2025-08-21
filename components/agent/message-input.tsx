'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  Info,
  Loader2,
  Mic,
  Paperclip,
  Square,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { omit } from 'remeda';
import { FilePreview } from '@/components/agent/file-preview';
import { AudioVisualizer } from '@/components/ui/audio-visualizer';
import { Button } from '@/components/ui/button';
import { InterruptPrompt } from '@/components/ui/interrupt-prompt';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAudioRecording } from '@/hooks/use-audio-recording';
import { useAutosizeTextArea } from '@/hooks/use-autosize-textarea';
import { useChatStore } from '@/providers/chat-store-provider';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { getEventReferenceChipColor, getCalendarColor, getDotColor } from '@/lib/calendar-utils/calendar-color-utils';
import { cn } from '@/lib/utils';
import { convertEventToReference, convertCalendarToReference } from '@/lib/store/chat-store';

interface MessageInputBaseProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  submitOnEnter?: boolean;
  stop?: () => void;
  isGenerating: boolean;
  enableInterrupt?: boolean;
  transcribeAudio?: (blob: Blob) => Promise<string>;
}

interface MessageInputWithoutAttachmentProps extends MessageInputBaseProps {
  allowAttachments?: false;
}

interface MessageInputWithAttachmentsProps extends MessageInputBaseProps {
  allowAttachments: true;
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
}

type MessageInputProps =
  | MessageInputWithoutAttachmentProps
  | MessageInputWithAttachmentsProps;

export function MessageInput({
  placeholder = 'Ask AI...',
  className,
  onKeyDown: onKeyDownProp,
  submitOnEnter = true,
  stop,
  isGenerating,
  enableInterrupt = true,
  transcribeAudio,
  ...props
}: MessageInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showInterruptPrompt, setShowInterruptPrompt] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 });

  const {
    isListening,
    isSpeechSupported,
    isRecording,
    isTranscribing,
    audioStream,
    toggleListening,
    stopRecording,
  } = useAudioRecording({
    transcribeAudio,
    onTranscriptionComplete: (text) => {
      props.onChange?.({ target: { value: text } } as any);
    },
  });

  useEffect(() => {
    if (!isGenerating) {
      setShowInterruptPrompt(false);
    }
  }, [isGenerating]);

  const checkForAtSymbol = (value: string, cursorPos: number) => {
    const textBeforeCursor = value.slice(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtSymbol + 1);
      const hasSpaceAfterAt = /\s/.test(textAfterAt);
      
      if (!hasSpaceAfterAt) {
        setIsPopoverOpen(true);
        calculateCursorCoords(cursorPos);
        return;
      }
    }
    
    setIsPopoverOpen(false);
  };

  const calculateCursorCoords = (cursorPos: number) => {
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const textBeforeCursor = props.value.slice(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    const lineNumber = lines.length - 1;
    
    const lineHeight = 20;
    const charWidth = 8;
    
    const x = currentLine.length * charWidth;
    const y = lineNumber * lineHeight;
    
    setCursorCoords({ x, y });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    
    setCursorPosition(cursorPos);
    checkForAtSymbol(value, cursorPos);
    
    props.onChange?.(e);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape' && isPopoverOpen) {
      e.preventDefault();
      setIsPopoverOpen(false);
      return;
    }
    
    onKeyDown(e);
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const cursorPos = target.selectionStart || 0;
    setCursorPosition(cursorPos);
    checkForAtSymbol(props.value, cursorPos);
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const cursorPos = target.selectionStart || 0;
    setCursorPosition(cursorPos);
    checkForAtSymbol(props.value, cursorPos);
  };

  const insertReference = (reference: string, eventRef?: any, calendarRef?: any) => {
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const value = props.value;
    const cursorPos = cursorPosition;
    
    const textBeforeCursor = value.slice(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1) {
      const textAfterCursor = value.slice(cursorPos);
      const newValue = value.slice(0, lastAtSymbol) + reference + textAfterCursor;
      
      props.onChange?.({ target: { value: newValue } } as any);
      
      const newCursorPos = lastAtSymbol + reference.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      setCursorPosition(newCursorPos);
    }
    
    if (eventRef) {
      addEventReference(eventRef);
    }
    if (calendarRef) {
      addCalendarReference(calendarRef);
    }
    
    setIsPopoverOpen(false);
  };

  const addFiles = (files: File[] | null) => {
    if (props.allowAttachments) {
      props.setFiles((currentFiles) => {
        if (currentFiles === null) {
          return files;
        }

        if (files === null) {
          return currentFiles;
        }

        return [...currentFiles, ...files];
      });
    }
  };

  const onDragOver = (event: React.DragEvent) => {
    if (props.allowAttachments !== true) return;
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: React.DragEvent) => {
    if (props.allowAttachments !== true) return;
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: React.DragEvent) => {
    setIsDragging(false);
    if (props.allowAttachments !== true) return;
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer.files.length) {
      addFiles(Array.from(dataTransfer.files));
    }
  };

  const onPaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const text = event.clipboardData.getData('text');
    if (text && text.length > 500 && props.allowAttachments) {
      event.preventDefault();
      const blob = new Blob([text], { type: 'text/plain' });
      const file = new File([blob], 'Pasted text', {
        type: 'text/plain',
        lastModified: Date.now(),
      });
      addFiles([file]);
      return;
    }

    const files = Array.from(items)
      .map((item) => item.getAsFile())
      .filter((file) => file !== null);

    if (props.allowAttachments && files.length > 0) {
      addFiles(files);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (submitOnEnter && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      if (isGenerating && stop && enableInterrupt) {
        if (showInterruptPrompt) {
          stop();
          setShowInterruptPrompt(false);
          event.currentTarget.form?.requestSubmit();
        } else if (
          props.value ||
          (props.allowAttachments && props.files?.length)
        ) {
          setShowInterruptPrompt(true);
          return;
        }
      }

      event.currentTarget.form?.requestSubmit();
    }

    if (event.key === 'Escape' && isGenerating && stop) {
      event.preventDefault();
      stop();
      setShowInterruptPrompt(false);
    }

    onKeyDownProp?.(event);
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState<number>(0);

  useEffect(() => {
    if (textAreaRef.current) {
      setTextAreaHeight(textAreaRef.current.offsetHeight);
    }
  }, [props.value]);

  const showFileList =
    props.allowAttachments && props.files && props.files.length > 0;

  useAutosizeTextArea({
    ref: textAreaRef as React.RefObject<HTMLTextAreaElement>,
    maxHeight: 240,
    borderWidth: 1,
    dependencies: [props.value, showFileList],
  });

  const eventReferences = useChatStore((state) => state.eventReferences);
  const calendarReferences = useChatStore((state) => state.calendarReferences);
  const addEventReference = useChatStore((state) => state.addEventReference);
  const addCalendarReference = useChatStore((state) => state.addCalendarReference);

  return (
    <div
      className="relative flex w-full"
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {enableInterrupt && (
        <InterruptPrompt
          close={() => setShowInterruptPrompt(false)}
          isOpen={showInterruptPrompt}
          onStop={stop}
        />
      )}

      <RecordingPrompt
        isVisible={isRecording}
        onStopRecording={stopRecording}
      />

      <div className="relative flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <div className="relative">
            <textarea
              aria-label="Write your prompt here"
              className={cn(
                'z-10 w-full grow resize-none rounded-xl border border-input bg-background p-3 pr-24 text-foreground text-sm ring-offset-background transition-[border] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                showFileList && 'pb-16',
                showInterruptPrompt && 'border-orange-500 ring-orange-500/20',
                className
              )}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              placeholder={placeholder}
              ref={textAreaRef}
              {...omit(props as MessageInputWithAttachmentsProps, [
                'allowAttachments',
                'files',
                'setFiles',
              ])}
            />
          </div>

          {props.allowAttachments && (
            <div className="absolute inset-x-3 bottom-0 z-20 overflow-x-scroll py-3">
              <div className="flex space-x-3">
                <AnimatePresence mode="popLayout">
                  {props.files?.map((file) => {
                    return (
                      <FilePreview
                        file={file}
                        key={file.name + String(file.lastModified)}
                        onRemove={() => {
                          props.setFiles((files) => {
                            if (!files) return null;

                            const filtered = Array.from(files).filter(
                              (f) => f !== file
                            );
                            if (filtered.length === 0) return null;
                            return filtered;
                          });
                        }}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
          <div className="absolute -top-8 left-0 right-0 flex items-center gap-2 overflow-hidden">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            className="flex h-6 px-2 items-center justify-center rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors flex-shrink-0"
                            aria-label="Reference events or calendars"
                            variant="outline"
                        >
                            <span className="text-sm font-medium">@</span>
                            {eventReferences.length === 0 && calendarReferences.length === 0 && (
                                <span className="text-xs">Add context</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-3 bg-neutral-900" align="start">
                        <EventReferencesPopover onSelect={insertReference} />
                    </PopoverContent>
                </Popover>
                
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    <EventReferencesInline />
                    <CalendarReferencesInline />
                </div>
             </div>
        </div>
      </div>

      <div className="absolute top-3 right-3 z-20 flex gap-2">
        {props.allowAttachments && (
          <Button
            aria-label="Attach a file"
            className="h-8 w-8"
            onClick={async () => {
              const files = await showFileUploadDialog();
              addFiles(files);
            }}
            size="icon"
            type="button"
            variant="outline"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        )}
        {isSpeechSupported && (
          <Button
            aria-label="Voice input"
            className={cn('h-8 w-8', isListening && 'text-primary')}
            onClick={toggleListening}
            size="icon"
            type="button"
            variant="outline"
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
        {isGenerating && stop ? (
          <Button
            aria-label="Stop generating"
            className="h-8 w-8 bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90"
            onClick={() => {
              stop();
              setShowInterruptPrompt(false);
            }}
            size="icon"
            title="Stop generation (Esc)"
            type="button"
          >
            <Square className="h-3 w-3" fill="currentColor" />
          </Button>
        ) : (
          <Button
            aria-label="Send message"
            className="h-8 w-8 bg-primary text-primary-foreground transition-opacity"
            disabled={props.value === '' || isGenerating}
            size="icon"
            type="submit"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </div>

      {props.allowAttachments && <FileUploadOverlay isDragging={isDragging} />}

      <RecordingControls
        audioStream={audioStream}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        onStopRecording={stopRecording}
        textAreaHeight={textAreaHeight}
      />
    </div>
  );
}
MessageInput.displayName = 'MessageInput';

interface FileUploadOverlayProps {
  isDragging: boolean;
}

function FileUploadOverlay({ isDragging }: FileUploadOverlayProps) {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center space-x-2 rounded-xl border border-border border-dashed bg-background text-muted-foreground text-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Paperclip className="h-4 w-4" />
          <span>Drop your files here to attach them.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function showFileUploadDialog() {
  const input = document.createElement('input');

  input.type = 'file';
  input.multiple = true;
  input.accept = '*/*';
  input.click();

  return new Promise<File[] | null>((resolve) => {
    input.onchange = (e) => {
      const files = (e.currentTarget as HTMLInputElement).files;

      if (files) {
        resolve(Array.from(files));
        return;
      }

      resolve(null);
    };
  });
}

function TranscribingOverlay() {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <motion.div
          animate={{ scale: 1.2, opacity: 1 }}
          className="absolute inset-0 h-8 w-8 animate-pulse rounded-full bg-primary/20"
          initial={{ scale: 0.8, opacity: 0 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      </div>
      <p className="mt-4 font-medium text-muted-foreground text-sm">
        Transcribing audio...
      </p>
    </motion.div>
  );
}

interface RecordingPromptProps {
  isVisible: boolean;
  onStopRecording: () => void;
}

function RecordingPrompt({ isVisible, onStopRecording }: RecordingPromptProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{
            top: -40,
            filter: 'blur(0px)',
            transition: {
              type: 'spring',
              filter: { type: 'tween' },
            },
          }}
          className="-translate-x-1/2 absolute left-1/2 flex cursor-pointer overflow-hidden whitespace-nowrap rounded-full border bg-background py-1 text-center text-muted-foreground text-sm"
          exit={{ top: 0, filter: 'blur(5px)' }}
          initial={{ top: 0, filter: 'blur(5px)' }}
          onClick={onStopRecording}
        >
          <span className="mx-2.5 flex items-center">
            <Info className="mr-2 h-3 w-3" />
            Click to finish recording
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface RecordingControlsProps {
  isRecording: boolean;
  isTranscribing: boolean;
  audioStream: MediaStream | null;
  textAreaHeight: number;
  onStopRecording: () => void;
}

function RecordingControls({
  isRecording,
  isTranscribing,
  audioStream,
  textAreaHeight,
  onStopRecording,
}: RecordingControlsProps) {
  if (isRecording) {
    return (
      <div
        className="absolute inset-[1px] z-50 overflow-hidden rounded-xl"
        style={{ height: textAreaHeight - 2 }}
      >
        <AudioVisualizer
          isRecording={isRecording}
          onClick={onStopRecording}
          stream={audioStream}
        />
      </div>
    );
  }

  if (isTranscribing) {
    return (
      <div
        className="absolute inset-[1px] z-50 overflow-hidden rounded-xl"
        style={{ height: textAreaHeight - 2 }}
      >
        <TranscribingOverlay />
      </div>
    );
  }

  return null;
}

function EventReferencesInline() {
  const eventReferences = useChatStore((state) => state.eventReferences);
  const removeEventReference = useChatStore((state) => state.removeEventReference);

  if (eventReferences.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-1">
      <AnimatePresence mode="popLayout">
        {eventReferences.map((event, index) => (
          <div
            key={`event-${event.id}-${index}`}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getEventReferenceChipColor(event.color || 'blue')}`}

          >
            <span className="truncate font-medium" title={event.title}>
              {event.title}
            </span>
            <button
              onClick={() => removeEventReference(event.id)}
              className="ml-1 h-4 w-4 rounded-full flex items-center justify-center transition-colors"
              aria-label={`Remove ${event.title} reference`}
            >
              <span className="text-xs">×</span>
            </button>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function CalendarReferencesInline() {
  const calendarReferences = useChatStore((state) => state.calendarReferences);
  const removeCalendarReference = useChatStore((state) => state.removeCalendarReference);

  if (calendarReferences.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-1">
      <AnimatePresence mode="popLayout">
        {calendarReferences.map((calendar, index) => (
          <div
            key={`calendar-${calendar.id}-${index}`}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-neutral-800 text-neutral-200 border border-neutral-700`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0`}
              style={{ backgroundColor: calendar.color || '#3b82f6' }}
            />
            <span className="truncate font-medium" title={calendar.name}>
              {calendar.name}
            </span>
            <button
              onClick={() => removeCalendarReference(calendar.id)}
              className="ml-1 h-4 w-4 rounded-full flex items-center justify-center transition-colors hover:bg-neutral-700"
              aria-label={`Remove ${calendar.name} reference`}
            >
              <span className="text-xs">×</span>
            </button>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function EventReferencesPopover({ onSelect }: { onSelect: (reference: string, eventRef?: any, calendarRef?: any) => void }) {
  const addEventReference = useChatStore((state) => state.addEventReference);
  const addCalendarReference = useChatStore((state) => state.addCalendarReference);
  const calendarEvents = useCalendarStore((state) => state.events);
  const googleEvents = useCalendarStore((state) => state.googleEvents);
  const sessionCalendars = useCalendarStore((state) => state.sessionCalendars);
  
  const allEvents = [...calendarEvents, ...googleEvents];
  const allCalendars = Object.values(sessionCalendars).flat();
  
  const handleEventSelect = (event: any) => {
    const eventRef = convertEventToReference(event);
    onSelect(`@${event.title}`, eventRef);
  };

  const handleCalendarSelect = (calendar: any) => {
    const calendarRef = convertCalendarToReference(calendar);
    onSelect(`@${calendar.summary || calendar.name}`, undefined, calendarRef);
  };

  return (
    <div className="space-y-3 overflow-y-auto scrollbar-hide">
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-foreground">Events</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {allEvents.length > 0 ? allEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => handleEventSelect(event)}
              className="w-full flex items-center gap-2 p-1.5 rounded-[10px] hover:bg-neutral-800/50 transition-colors text-left cursor-pointer focus:outline-none"
            >
              <div 
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getDotColor(event.color || 'blue')}`}

              />
              <span className="text-xs text-foreground truncate">{event.title}</span>
            </button>
          )) : (
            <p className="text-xs text-muted-foreground px-1.5">No events available</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-foreground">
            Calendars
        </h4>
        <div className="space-y-1 max-h-20">
          {allCalendars.length > 0 ? allCalendars.map((calendar) => (
            <button
              key={calendar.id}
              onClick={() => handleCalendarSelect(calendar)}
              className="w-full flex items-center gap-2 p-1.5 transition-colors text-left rounded-[10px] hover:bg-neutral-800/50 cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <div
                        className={`h-3 w-3 rounded-xs ${getCalendarColor(calendar)}`}
                        style={{ backgroundColor: getCalendarColor(calendar) }}
                    />
                    <span className="text-xs text-foreground truncate">{calendar.summary || calendar.name}</span>
                </div>
            </button>
          )) : (
            <p className="text-xs text-muted-foreground px-1.5">No calendars available</p>
          )}
        </div>
      </div>
    </div>
  );
}

function InlineEventSuggestions({ onSelect }: { onSelect: (reference: string, eventRef?: any, calendarRef?: any) => void }) {
  const addEventReference = useChatStore((state) => state.addEventReference);
  const calendarEvents = useCalendarStore((state) => state.events);
  const googleEvents = useCalendarStore((state) => state.googleEvents);
  
  const allEvents = [...calendarEvents, ...googleEvents].slice(0, 3);
  
  const handleEventSelect = (event: any) => {
    const eventRef = convertEventToReference(event);
    onSelect(`@${event.title}`, eventRef);
  };

  if (allEvents.length === 0) {
    return (
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted-foreground bg-muted/30">
        <span>No events</span>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      {allEvents.map((event) => (
        <button
          key={event.id}
          onClick={() => handleEventSelect(event)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-muted/50 hover:bg-muted transition-colors cursor-pointer border border-border/50"
          title={event.title}
        >
          <div 
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getDotColor(event.color || 'blue')}`}
          />
          <span className="text-foreground truncate max-w-16">{event.title}</span>
        </button>
      ))}
    </div>
  );
}

function InlineCalendarSuggestions({ onSelect }: { onSelect: (reference: string, eventRef?: any, calendarRef?: any) => void }) {
  const addCalendarReference = useChatStore((state) => state.addCalendarReference);
  const sessionCalendars = useCalendarStore((state) => state.sessionCalendars);
  
  const allCalendars = Object.values(sessionCalendars).flat().slice(0, 2);
  
  const handleCalendarSelect = (calendar: any) => {
    const calendarRef = convertCalendarToReference(calendar);
    onSelect(`@${calendar.summary || calendar.name}`, undefined, calendarRef);
  };

  if (allCalendars.length === 0) {
    return (
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted-foreground bg-muted/30">
        <span>No calendars</span>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      {allCalendars.map((calendar) => (
        <button
          key={calendar.id}
          onClick={() => handleCalendarSelect(calendar)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-muted/50 hover:bg-muted transition-colors cursor-pointer border border-border/50"
          title={calendar.summary || calendar.name}
        >
          <div
            className="h-1.5 w-1.5 rounded-xs flex-shrink-0"
            style={{ backgroundColor: getCalendarColor(calendar) }}
          />
          <span className="text-foreground truncate max-w-12">{calendar.summary || calendar.name}</span>
        </button>
      ))}
    </div>
  );
}
