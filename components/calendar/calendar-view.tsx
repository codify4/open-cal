'use client';

import { SignedOut, useSession, useSessionList, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDaysIcon,
  RefreshCw,
  ChevronDown,
  Plus,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BsCalendarMonth, BsCalendarWeek } from 'react-icons/bs';
import { getAccessToken } from '@/actions/access-token';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/convex/_generated/api';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import type { ClassNames, Views } from '@/types/index';
import { TextShimmer } from '../agent/text-shimmer';
import DailyView from './view/daily-view';
import MonthView from './view/month-view';
import WeeklyView from './view/week-view';

const animationConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, type: 'spring', stiffness: 250 },
};

export default function CalendarView({
  views = {
    views: ['day', 'week', 'month'],
    mobileViews: ['day', 'week', 'month'],
  },
  stopDayEventSummary = false,
  classNames,
}: {
  views?: Views;
  stopDayEventSummary?: boolean;
  classNames?: ClassNames;
}) {
  const [clientSide, setClientSide] = useState(false);

  const {
    currentDate,
    viewType,
    setViewType,
    goToToday,
    goToPreviousDay,
    goToNextDay,
    goToPreviousWeek,
    goToNextWeek,
    goToPreviousMonth,
    goToNextMonth,
    isFetchingEvents,
    refreshEvents,
    setRefreshFunction,
    openEventSidebarForNewEvent,
  } = useCalendarStore((state) => state);

  const { user } = useUser();
  const { sessions } = useSessionList();
  const { session: currentSession } = useSession();
  const { refreshEvents: refreshGoogleEvents } = useGoogleCalendarRefresh();
  const { sessionCalendars, visibleCalendarIds, isFetchingCalendars } = useCalendarStore((state) => state);
  
  const hasAnyConnectedAccount = Object.keys(sessionCalendars).length > 0 && visibleCalendarIds.length > 0;
  const isLoadingCalendars = isFetchingCalendars;

  useEffect(() => {
    setClientSide(true);
  }, []);

  useEffect(() => {
    if (hasAnyConnectedAccount) {
      setRefreshFunction(refreshGoogleEvents);
    }
  }, [setRefreshFunction, refreshGoogleEvents, hasAnyConnectedAccount]);

  const [isMobile, setIsMobile] = useState(
    clientSide ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    if (!clientSide) return;
    setIsMobile(window.innerWidth <= 768);
    function handleResize() {
      if (window && window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    window && window.addEventListener('resize', handleResize);

    return () => window && window.removeEventListener('resize', handleResize);
  }, [clientSide]);

  const getDaysInWeek = (week: number, year: number) => {
    const weekStartsOn = 'sunday';
    const startDay = weekStartsOn === 'sunday' ? 0 : 1;
    const currentDayOfWeek = currentDate.getDay();
    const daysToSubtract = (currentDayOfWeek - startDay + 7) % 7;
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - daysToSubtract);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getViewTitle = (viewType: string) => {
    const date =
      currentDate instanceof Date ? currentDate : new Date(currentDate);

    if (viewType === 'day') {
      return (
        <>
          <span className="hidden sm:inline">
            {date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="sm:hidden">
            {date.toLocaleDateString('en-US', {
              month: 'long',
            })}
          </span>
        </>
      );
    }
    if (viewType === 'week') {
      const daysOfWeek = getDaysInWeek(1, date.getFullYear());

      const startOfWeek = daysOfWeek[0];
      const endOfWeek = daysOfWeek[6];

      return (
        <>
          <span className="hidden sm:inline">
            {`${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          </span>
          <span className="sm:hidden">
            {date.toLocaleDateString('en-US', {
              month: 'long',
            })}
          </span>
        </>
      );
    }
    return (
      <>
        <span className="hidden sm:inline">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          })}
        </span>
        <span className="sm:hidden">
          {date.toLocaleDateString('en-US', {
            month: 'long',
          })}
        </span>
      </>
    );
  };

  const handlePrev = () => {
    if (viewType === 'day') {
      goToPreviousDay();
    } else if (viewType === 'week') {
      goToPreviousWeek();
    } else if (viewType === 'month') {
      goToPreviousMonth();
    }
  };

  const handleNext = () => {
    if (viewType === 'day') {
      goToNextDay();
    } else if (viewType === 'week') {
      goToNextWeek();
    } else if (viewType === 'month') {
      goToNextMonth();
    }
  };

  const handleGoToToday = () => {
    goToToday();
  };

  const handleViewChange = (newView: string) => {
    setViewType(newView as 'day' | 'week' | 'month');
  };

  return (
    <div className="flex w-full flex-col gap-6 p-2">
      <div className="flex w-full">
        <div className="relative w-full">
          <Tabs
            className={cn('w-full', classNames?.tabs)}
            onValueChange={handleViewChange}
            value={viewType}
          >
            <div className="sticky top-0 z-50 flex items-center justify-between border-border border-b backdrop-blur">
              <div className="flex w-full items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-2">
                  <div className="mr-2 flex items-center gap-2">
                    <SidebarTrigger
                      disabled={!hasAnyConnectedAccount || isLoadingCalendars}
                      title={
                        hasAnyConnectedAccount && !isLoadingCalendars
                          ? undefined
                          : isLoadingCalendars
                          ? 'Loading calendars...'
                          : 'Connect Google Calendar to access sidebar'
                      }
                    />
                    <h1 className="font-semibold text-lg">
                      {getViewTitle(viewType)}
                    </h1>
                  </div>

                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      className={cn(classNames?.buttons?.prev, "h-7 w-7 p-0 sm:h-8 sm:w-auto sm:px-3")}
                      disabled={!hasAnyConnectedAccount || isLoadingCalendars}
                      onClick={handlePrev}
                      size="sm"
                      title={
                        hasAnyConnectedAccount && !isLoadingCalendars
                          ? undefined
                          : isLoadingCalendars
                          ? 'Loading calendars...'
                          : 'Connect Google Calendar to navigate calendar'
                      }
                      variant="outline"
                    >
                      <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      className={cn(classNames?.buttons?.next, "h-7 w-7 p-0 sm:h-8 sm:w-auto sm:px-3")}
                      disabled={!hasAnyConnectedAccount || isLoadingCalendars}
                      onClick={handleNext}
                      size="sm"
                      title={
                        hasAnyConnectedAccount && !isLoadingCalendars
                          ? undefined
                          : isLoadingCalendars
                          ? 'Loading calendars...'
                          : 'Connect Google Calendar to navigate calendar'
                      }
                      variant="outline"
                    >
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="hidden h-8 rounded-sm bg-muted px-3 text-sm sm:flex"
                    disabled={isFetchingEvents || !hasAnyConnectedAccount || isLoadingCalendars}
                    onClick={refreshEvents}
                    title={
                      hasAnyConnectedAccount && !isLoadingCalendars
                        ? undefined
                        : isLoadingCalendars
                        ? 'Loading calendars...'
                        : 'Connect Google Calendar to refresh events'
                    }
                    variant="outline"
                  >
                    {isFetchingEvents && (
                      <TextShimmer duration={1}>Refreshing...</TextShimmer>
                    )}
                    <RefreshCw
                      className={`h-4 w-4 ${isFetchingEvents ? 'animate-spin' : ''}`}
                    />
                  </Button>
                  <Button
                    className="hidden h-8 w-20 rounded-sm bg-muted text-sm sm:flex"
                    disabled={!hasAnyConnectedAccount || isLoadingCalendars}
                    onClick={handleGoToToday}
                    title={
                      hasAnyConnectedAccount && !isLoadingCalendars
                        ? undefined
                        : isLoadingCalendars
                        ? 'Loading calendars...'
                        : 'Connect Google Calendar to navigate calendar'
                    }
                    variant="outline"
                  >
                    Today
                  </Button>
                  <Button
                    className="flex h-7 w-7 rounded-sm bg-muted text-sm sm:hidden"
                    disabled={!hasAnyConnectedAccount || isLoadingCalendars}
                    onClick={handleGoToToday}
                    title={
                      hasAnyConnectedAccount && !isLoadingCalendars
                        ? undefined
                        : isLoadingCalendars
                        ? 'Loading calendars...'
                        : 'Connect Google Calendar to navigate calendar'
                    }
                    variant="outline"
                  >
                    {currentDate.getDate()}
                  </Button>
                  <Button
                    className="flex h-7 w-7 rounded-sm bg-muted text-xs sm:hidden"
                    disabled={isFetchingEvents || !hasAnyConnectedAccount || isLoadingCalendars}
                    onClick={refreshEvents}
                    title={
                      hasAnyConnectedAccount && !isLoadingCalendars
                        ? undefined
                        : isLoadingCalendars
                        ? 'Loading calendars...'
                        : 'Connect Google Calendar to refresh events'
                    }
                    variant="outline"
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${isFetchingEvents ? 'animate-spin' : ''}`}
                    />
                  </Button>
                  {isMobile ? (
                    <Select onValueChange={handleViewChange} value={viewType}>
                      <SelectTrigger className="h-6 px-2 py-0 text-sm" disabled={isLoadingCalendars}>
                        <SelectValue>
                          {viewType === 'day' && (
                            <div className="flex items-center space-x-1">
                              <CalendarDaysIcon size={12} />
                              <span>Day</span>
                            </div>
                          )}
                          {viewType === 'week' && (
                            <div className="flex items-center space-x-1">
                              <BsCalendarWeek size={8} />
                              <span>Week</span>
                            </div>
                          )}
                          {viewType === 'month' && (
                            <div className="flex items-center space-x-1">
                              <BsCalendarMonth size={12} />
                              <span>Month</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">
                          <div className="flex items-center space-x-1">
                            <CalendarDaysIcon size={12} />
                            <span>Day</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="week">
                          <div className="flex items-center space-x-1">
                            <BsCalendarWeek size={12} />
                            <span>Week</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="month">
                          <div className="flex items-center space-x-1">
                            <BsCalendarMonth size={12} />
                            <span>Month</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger
                        disabled={!hasAnyConnectedAccount || isLoadingCalendars}
                        title={
                          hasAnyConnectedAccount && !isLoadingCalendars
                            ? undefined
                            : isLoadingCalendars
                            ? 'Loading calendars...'
                            : 'Connect Google Calendar to view calendar'
                        }
                        value="day"
                      >
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon size={15} />
                          <span>Day</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        disabled={!hasAnyConnectedAccount || isLoadingCalendars}
                        title={
                          hasAnyConnectedAccount && !isLoadingCalendars
                            ? undefined
                            : isLoadingCalendars
                            ? 'Loading calendars...'
                            : 'Connect Google Calendar to view calendar'
                        }
                        value="week"
                      >
                        <div className="flex items-center space-x-2">
                          <BsCalendarWeek />
                          <span>Week</span>
                        </div>
                      </TabsTrigger>

                      <TabsTrigger
                        disabled={!hasAnyConnectedAccount || isLoadingCalendars}
                        title={
                          hasAnyConnectedAccount && !isLoadingCalendars
                            ? undefined
                            : isLoadingCalendars
                            ? 'Loading calendars...'
                            : 'Connect Google Calendar to view calendar'
                        }
                        value="month"
                      >
                        <div className="flex items-center space-x-2">
                          <BsCalendarMonth />
                          <span>Month</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  )}
                </div>
              </div>
            </div>
            <TabsContent value="day">
              <AnimatePresence mode="wait">
                <motion.div {...animationConfig}>
                  {isLoadingCalendars ? (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                      <div className="max-w-md text-center">
                        <h3 className="mb-2 font-semibold text-lg">
                          Loading Calendars
                        </h3>
                        <p className="mb-4 text-muted-foreground text-sm">
                          Fetching your Google Calendar accounts...
                        </p>
                      </div>
                    </div>
                  ) : hasAnyConnectedAccount ? (
                    <DailyView />
                  ) : (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                      <div className="max-w-md text-center">
                        <h3 className="mb-2 font-semibold text-lg">
                          No Calendar Connected
                        </h3>
                        <p className="mb-4 text-muted-foreground text-sm">
                          Connect your Google Calendar accounts to view and
                          manage your events.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="week">
              <AnimatePresence mode="wait">
                <motion.div {...animationConfig}>
                  {isLoadingCalendars ? (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                      <div className="max-w-md text-center">
                        <h3 className="mb-2 font-semibold text-lg">
                          Loading Calendars
                        </h3>
                        <p className="mb-4 text-muted-foreground text-sm">
                          Fetching your Google Calendar accounts...
                        </p>
                      </div>
                    </div>
                  ) : hasAnyConnectedAccount ? (
                    <WeeklyView />
                  ) : (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                      <div className="max-w-md text-center">
                        <h3 className="mb-2 font-semibold text-lg">
                          No Calendar Connected
                        </h3>
                        <p className="mb-4 text-muted-foreground text-sm">
                          Connect your Google Calendar accounts to view and
                          manage your events.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="month">
              <AnimatePresence mode="wait">
                <motion.div {...animationConfig}>
                  {isLoadingCalendars ? (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                      <div className="max-w-md text-center">
                        <h3 className="mb-2 font-semibold text-lg">
                          Loading Calendars
                        </h3>
                        <p className="mb-4 text-muted-foreground text-sm">
                          Fetching your Google Calendar accounts...
                        </p>
                      </div>
                    </div>
                  ) : hasAnyConnectedAccount ? (
                    <MonthView />
                  ) : (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                      <div className="mb-2 font-semibold text-lg">
                        No Calendar Connected
                      </div>
                      <p className="mb-4 text-muted-foreground text-sm">
                        Connect your Google Calendar accounts to view and
                        manage your events.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {isMobile && hasAnyConnectedAccount && (
        <div className="fixed bottom-16 right-4 z-50">
          <Button
            className="rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10"
            disabled={isLoadingCalendars}
            onClick={() => {
              const now = new Date();
              openEventSidebarForNewEvent(now);
            }}
            size="icon"
          >
            <Plus className="h-7 w-7" />
          </Button>
        </div>
      )}
      
      <SignedOut>
        <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/50 p-8">
          <div className="max-w-md text-center">
            <h3 className="mb-2 font-semibold text-lg">
              Connect Google Calendar
            </h3>
            <p className="mb-4 text-muted-foreground text-sm">
              To view and manage your calendar events, please connect your
              Google Calendar account.
            </p>
            <Button size="sm" variant="outline">
              Connect Google Calendar
            </Button>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
