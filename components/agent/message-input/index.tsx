'use client';

import { AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Mic,
  Paperclip,
  Square,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { omit } from 'remeda';
import { FilePreview } from '@/components/agent/file-preview';
import { Button } from '@/components/ui/button';
import { InterruptPrompt } from '@/components/ui/interrupt-prompt';
import { useAudioRecording } from '@/hooks/use-audio-recording';
import { useAutosizeTextArea } from '@/hooks/use-autosize-textarea';
import { useChatStore } from '@/providers/chat-store-provider';
import { cn } from '@/lib/utils';
import { ReferencePopover } from '@/components/agent/message-input/reference-popover';
import { ReferenceChips } from '@/components/agent/message-input/reference-chips';
import { FileUploadOverlay } from '@/components/agent/message-input/file-upload-overlay';
import { RecordingControls } from '@/components/agent/message-input/recording-controls';
import { RecordingPrompt } from '@/components/agent/message-input/recording-prompt';

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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    
    setCursorPosition(cursorPos);
    
    props.onChange?.(e);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape' && isPopoverOpen) {
      e.preventDefault();
      setIsPopoverOpen(false);
      return;
    }
    
    onKeyDownProp?.(e);
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const cursorPos = target.selectionStart || 0;
    setCursorPosition(cursorPos);
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const cursorPos = target.selectionStart || 0;
    setCursorPosition(cursorPos);
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
              onChange={handleTextareaChange}
              onClick={handleTextareaClick}
              onSelect={handleTextareaSelect} 
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
            <ReferencePopover 
              isOpen={isPopoverOpen} 
              onOpenChange={setIsPopoverOpen}
              onSelect={insertReference}
            />
            <ReferenceChips />
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
