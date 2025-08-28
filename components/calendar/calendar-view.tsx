'use client';

import { SignedOut } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDaysIcon,
  RefreshCw,
  Plus,
} from 'lucide-react';
import React, { useEffect, useState, memo } from 'react';
import { BsCalendarMonth, BsCalendarWeek } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import type { ClassNames, Views } from '@/types/index';
import { TextShimmer } from '../agent/text-shimmer';
import DailyView from './view/daily-view';
import MonthView from './view/month-view';
import WeeklyView from './view/week-view';
import { SignedOutCalendarGrid } from './view/signed-out-calendar-grid';

const animationConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, type: 'spring', stiffness: 250 },
};

const CalendarView = memo(function CalendarView({
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
    const date = currentDate instanceof Date ? currentDate : new Date(currentDate);

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
      const weekStartsOn = 1;
      const currentDayOfWeek = date.getDay();
      const daysToSubtract = (currentDayOfWeek - weekStartsOn + 7) % 7;
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - daysToSubtract);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      return (
        <>
          <span className="hidden sm:inline">
            {`${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
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
    <div className="flex w-full flex-col">
      <div className="flex w-full">
        <div className="relative w-full">
          <Tabs
            className={cn('w-full', classNames?.tabs)}
            onValueChange={handleViewChange}
            value={viewType}
          >
            <div className="sticky top-0 z-50 flex items-center justify-between border-border border-b backdrop-blur pt-2 px-2">
              <div className="flex w-full items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-2">
                  <div className="mr-2 flex items-center gap-2">
                    <SidebarTrigger />
                    <h1 className="font-semibold text-lg">
                      {getViewTitle(viewType)}
                    </h1>
                  </div>

                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      className={cn(classNames?.buttons?.prev, "h-7 w-7 p-0 sm:h-8 sm:w-auto sm:px-3")}
                      onClick={handlePrev}
                      size="sm"
                      variant="outline"
                    >
                      <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      className={cn(classNames?.buttons?.next, "h-7 w-7 p-0 sm:h-8 sm:w-auto sm:px-3")}
                      onClick={handleNext}
                      size="sm"
                      variant="outline"
                    >
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="hidden h-8 rounded-sm bg-muted px-3 text-sm sm:flex"
                    onClick={refreshEvents}
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
                    onClick={handleGoToToday}
                    variant="outline"
                  >
                    Today
                  </Button>
                  <Button
                    className="flex h-7 w-7 rounded-sm bg-muted text-sm sm:hidden"
                    onClick={handleGoToToday}
                    variant="outline"
                  >
                    {currentDate.getDate()}
                  </Button>
                  <Button
                    className="flex h-7 w-7 rounded-sm bg-muted text-xs sm:hidden"
                    onClick={refreshEvents}
                    variant="outline"
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${isFetchingEvents ? 'animate-spin' : ''}`}
                    />
                  </Button>
                  {isMobile ? (
                    <Select onValueChange={handleViewChange} value={viewType}>
                      <SelectTrigger className="h-6 px-2 py-0 text-sm">
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
                      <TabsTrigger value="day">
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon size={15} />
                          <span>Day</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="week">
                        <div className="flex items-center space-x-2">
                          <BsCalendarWeek />
                          <span>Week</span>
                        </div>
                      </TabsTrigger>

                      <TabsTrigger value="month">
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
                  <DailyView />
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="week">
              <AnimatePresence mode="wait">
                <motion.div {...animationConfig}>
                  <WeeklyView />
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="month">
              <AnimatePresence mode="wait">
                <motion.div {...animationConfig}>
                  <MonthView />
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
        <div className="flex flex-col gap-4">
          <SignedOutCalendarGrid viewType={viewType} />
        </div>
      </SignedOut>
    </div>
  );
});

export default CalendarView;
