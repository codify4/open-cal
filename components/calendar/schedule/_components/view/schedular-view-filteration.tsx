"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, CalendarDaysIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { BsCalendarMonth, BsCalendarWeek } from "react-icons/bs";

import AddEventModal from "../../_modals/add-event-modal";
import DailyView from "./day/daily-view";
import MonthView from "./month/month-view";
import WeeklyView from "./week/week-view";
import { useModal } from "@/providers/modal-context";
import { useScheduler } from "@/providers/schedular-provider";
import { ClassNames, CustomComponents, Views } from "@/types/index";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Animation settings for Framer Motion
const animationConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, type: "spring", stiffness: 250 },
};

export default function SchedulerViewFilteration({
  views = {
    views: ["day", "week", "month"],
    mobileViews: ["day"],
  },
  stopDayEventSummary = false,
  CustomComponents,
  classNames,
}: {
  views?: Views;
  stopDayEventSummary?: boolean;
  CustomComponents?: CustomComponents;
  classNames?: ClassNames;
}) {
  const { setOpen } = useModal();
  const { handlers, getters } = useScheduler();
  const [activeView, setActiveView] = useState<string>("day");
  const [clientSide, setClientSide] = useState(false);

  console.log("activeView", activeView);

  useEffect(() => {
    setClientSide(true);
  }, []);

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

    window && window.addEventListener("resize", handleResize);

    return () => window && window.removeEventListener("resize", handleResize);
  }, [clientSide]);

  const getViewTitle = (viewType: string) => {
    const currentDate = getters.getCurrentDate()
    
    if (viewType === "day") {
      return (
        <>
          <span className="hidden sm:inline">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="sm:hidden">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
            })}
          </span>
        </>
      )
    } else if (viewType === "week") {
      // Use the same logic as the week view to get the correct week range
      const daysOfWeek = getters.getDaysInWeek(
        getters.getWeekNumber(currentDate),
        currentDate.getFullYear()
      );
      
      const startOfWeek = daysOfWeek[0];
      const endOfWeek = daysOfWeek[6];

      return (
        <>
          <span className="hidden sm:inline">
            {`${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
          </span>
          <span className="sm:hidden">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
            })}
          </span>
        </>
      )
    } else {
      return (
        <>
          <span className="hidden sm:inline">
            {currentDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </span>
          <span className="sm:hidden">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
            })}
          </span>
        </>
      )
    }
  }

  const viewsSelector = isMobile ? views?.mobileViews : views?.views;

  useEffect(() => {
    if (viewsSelector?.length) {
      setActiveView(viewsSelector[0]);
    }
  }, []);

  const handlePrev = () => {
    switch (activeView) {
      case "day":
        handlers.handlePrevDay();
        break;
      case "week":
        handlers.handlePrevWeek();
        break;
      case "month":
        handlers.handlePrevMonth();
        break;
    }
  };

  const handleNext = () => {
    switch (activeView) {
      case "day":
        handlers.handleNextDay();
        break;
      case "week":
        handlers.handleNextWeek();
        break;
      case "month":
        handlers.handleNextMonth();
        break;
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full">
        <div className="dayly-weekly-monthly-selection relative w-full">
          <Tabs
            value={activeView}
            onValueChange={setActiveView}
            className={cn("w-full", classNames?.tabs)}
          >
            <div className="flex justify-between items-center border-b border-border">
              <div className="flex items-center justify-between w-full gap-4 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mr-2">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">
                      {getViewTitle(activeView)}
                    </h1>
                  </div>

                  <div className="flex gap-2">
                    {CustomComponents?.customButtons?.CustomPrevButton ? (
                      <div onClick={handlePrev}>{CustomComponents.customButtons.CustomPrevButton}</div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className={classNames?.buttons?.prev}
                        onClick={handlePrev}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                    {CustomComponents?.customButtons?.CustomNextButton ? (
                      <div onClick={handleNext}>{CustomComponents.customButtons.CustomNextButton}</div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className={classNames?.buttons?.next}
                        onClick={handleNext}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="hidden sm:flex bg-muted rounded-sm w-20 h-8 text-sm"
                  onClick={() => {
                    handlers.handleGoToToday();
                  }}
                >
                  Today
                </Button>
                  <TabsList className="grid grid-cols-3">
                    {viewsSelector?.includes("day") && (
                      <TabsTrigger value="day">
                        {CustomComponents?.customTabs?.CustomDayTab ? (
                          CustomComponents.customTabs.CustomDayTab
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CalendarDaysIcon size={15} />
                            <span>Day</span>
                          </div>
                        )}
                      </TabsTrigger>
                    )}

                    {viewsSelector?.includes("week") && (
                      <TabsTrigger value="week">
                        {CustomComponents?.customTabs?.CustomWeekTab ? (
                          CustomComponents.customTabs.CustomWeekTab
                        ) : (
                          <div className="flex items-center space-x-2">
                            <BsCalendarWeek />
                            <span>Week</span>
                          </div>
                        )}
                      </TabsTrigger>
                    )}

                    {viewsSelector?.includes("month") && (
                      <TabsTrigger value="month">
                        {CustomComponents?.customTabs?.CustomMonthTab ? (
                          CustomComponents.customTabs.CustomMonthTab
                        ) : (
                          <div className="flex items-center space-x-2">
                            <BsCalendarMonth />
                            <span>Month</span>
                          </div>
                        )}
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>
              </div>
            </div>

            {viewsSelector?.includes("day") && (
              <TabsContent value="day">
                <AnimatePresence mode="wait">
                  <motion.div {...animationConfig}>
                    <DailyView
                      stopDayEventSummary={stopDayEventSummary}
                      classNames={classNames?.buttons}
                      CustomEventComponent={
                        CustomComponents?.CustomEventComponent
                      }
                      CustomEventModal={CustomComponents?.CustomEventModal}
                    />
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            )}

            {viewsSelector?.includes("week") && (
              <TabsContent value="week">
                <AnimatePresence mode="wait">
                  <motion.div {...animationConfig}>
                    <WeeklyView
                      classNames={classNames?.buttons}
                      CustomEventComponent={
                        CustomComponents?.CustomEventComponent
                      }
                      CustomEventModal={CustomComponents?.CustomEventModal}
                    />
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            )}

            {viewsSelector?.includes("month") && (
              <TabsContent value="month">
                <AnimatePresence mode="wait">
                  <motion.div {...animationConfig}>
                    <MonthView
                      classNames={classNames?.buttons}
                      CustomEventComponent={
                        CustomComponents?.CustomEventComponent
                      }
                      CustomEventModal={CustomComponents?.CustomEventModal}
                    />
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
