'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarDaysIcon, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BsCalendarMonth, BsCalendarWeek } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { ClassNames, Views } from '@/types/index';
import DailyView from './view/daily-view';
import MonthView from './view/month-view';
import WeeklyView from './view/week-view';
import { TextShimmer } from '../agent/text-shimmer';
import { getAccessToken } from '@/actions/access-token';

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
    } = useCalendarStore((state) => state);

    const { user } = useUser();
    const { refreshEvents: refreshGoogleEvents } = useGoogleCalendarRefresh();
    const [hasGoogleCalendar, setHasGoogleCalendar] = useState(false);

    useEffect(() => {
        setClientSide(true);
    }, []);

    useEffect(() => {
        const fetchAccessToken = async () => {
            const token = await getAccessToken();
            if (token) {
                setRefreshFunction(refreshGoogleEvents);
                setHasGoogleCalendar(true);
            } else {
                setHasGoogleCalendar(false);
            }
        };
        fetchAccessToken();
    }, [setRefreshFunction, refreshGoogleEvents]);

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
            <div className='lg:hidden fixed top-0 left-0 w-full h-screen bg-black/90 z-50' />
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
                                        <SidebarTrigger disabled={!hasGoogleCalendar} title={!hasGoogleCalendar ? "Connect Google Calendar to access sidebar" : undefined} />
                                        <h1 className="font-semibold text-lg">
                                            {getViewTitle(viewType)}
                                        </h1>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            className={classNames?.buttons?.prev}
                                            onClick={handlePrev}
                                            size="sm"
                                            variant="outline"
                                            disabled={!hasGoogleCalendar}
                                            title={!hasGoogleCalendar ? "Connect Google Calendar to navigate calendar" : undefined}
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            className={classNames?.buttons?.next}
                                            onClick={handleNext}
                                            size="sm"
                                            variant="outline"
                                            disabled={!hasGoogleCalendar}
                                            title={!hasGoogleCalendar ? "Connect Google Calendar to navigate calendar" : undefined}
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        className="hidden h-8 px-3 rounded-sm bg-muted text-sm sm:flex"
                                        onClick={refreshEvents}
                                        disabled={isFetchingEvents || !hasGoogleCalendar}
                                        variant="outline"
                                        title={!hasGoogleCalendar ? "Connect Google Calendar to refresh events" : undefined}
                                    >
                                        {isFetchingEvents && (<TextShimmer duration={1}>Refreshing...</TextShimmer>)}
                                        <RefreshCw className={`h-4 w-4 ${isFetchingEvents ? 'animate-spin' : ''}`} />
                                    </Button>
                                    <Button
                                        className="hidden h-8 w-20 rounded-sm bg-muted text-sm sm:flex"
                                        onClick={handleGoToToday}
                                        disabled={!hasGoogleCalendar}
                                        variant="outline"
                                        title={!hasGoogleCalendar ? "Connect Google Calendar to navigate calendar" : undefined}
                                    >
                                        Today
                                    </Button>
                                    <TabsList className="grid grid-cols-3">
                                        <TabsTrigger value="day" disabled={!hasGoogleCalendar} title={!hasGoogleCalendar ? "Connect Google Calendar to view calendar" : undefined}>
                                            <div className="flex items-center space-x-2">
                                                <CalendarDaysIcon size={15} />
                                                <span>Day</span>
                                            </div>
                                        </TabsTrigger>
                                        <TabsTrigger value="week" disabled={!hasGoogleCalendar} title={!hasGoogleCalendar ? "Connect Google Calendar to view calendar" : undefined}>
                                            <div className="flex items-center space-x-2">
                                                <BsCalendarWeek />
                                                <span>Week</span>
                                            </div>
                                        </TabsTrigger>

                                        <TabsTrigger value="month" disabled={!hasGoogleCalendar} title={!hasGoogleCalendar ? "Connect Google Calendar to view calendar" : undefined}>
                                            <div className="flex items-center space-x-2">
                                                <BsCalendarMonth />
                                                <span>Month</span>
                                            </div>
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>
                        </div>
                        <TabsContent value="day">
                            <AnimatePresence mode="wait">
                                <motion.div {...animationConfig}>
                                    {hasGoogleCalendar ? (
                                        <DailyView />
                                    ) : (
                                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                                            Connect your Google Calendar to view events
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </TabsContent>

                        <TabsContent value="week">
                            <AnimatePresence mode="wait">
                                <motion.div {...animationConfig}>
                                    {hasGoogleCalendar ? (
                                        <WeeklyView />
                                    ) : (
                                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                                            Connect your Google Calendar to view events
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </TabsContent>

                        <TabsContent value="month">
                            <AnimatePresence mode="wait">
                                <motion.div {...animationConfig}>
                                    {hasGoogleCalendar ? (
                                        <MonthView />
                                    ) : (
                                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                                            Connect your Google Calendar to view events
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            {!hasGoogleCalendar && (
                <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg border border-dashed">
                    <div className="text-center max-w-md">
                        <h3 className="font-semibold text-lg mb-2">Connect Google Calendar</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            To view and manage your calendar events, please connect your Google Calendar account.
                        </p>
                        <Button variant="outline" size="sm">
                            Connect Google Calendar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
