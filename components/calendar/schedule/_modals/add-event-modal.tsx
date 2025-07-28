"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { useModal } from "@/providers/modal-context";
import SelectDate from "@/components/calendar/schedule/_components/add-event-components/select-date";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormData, eventSchema, Event } from "@/types/index";
import { useScheduler } from "@/providers/schedular-provider";
import { v4 as uuidv4 } from "uuid"; // Use UUID to generate event IDs

export default function AddEventModal({
  CustomAddEventModal,
}: {
  CustomAddEventModal?: React.FC<{ register: any; errors: any }>;
}) {
  const { setClose, data } = useModal();

  const [selectedColor, setSelectedColor] = useState<string>(
    getEventColor(data?.color || "blue")
  );

  const typedData = data as { default: Event };

  const { handlers } = useScheduler();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      color: data?.color || "blue",
    },
  });

  // Reset the form on initialization
  useEffect(() => {
    if (data?.default) {
      const eventData = data?.default;
      console.log("eventData", eventData);
      reset({
        title: eventData.title,
        description: eventData.description || "",
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        color: eventData.color || "blue",
      });
    }
  }, [data, reset]);

  const colorOptions = [
    { key: "blue", name: "Blue" },
    { key: "red", name: "Red" },
    { key: "green", name: "Green" },
    { key: "yellow", name: "Yellow" },
  ];

  function getEventColor(color: string) {
    switch (color) {
      case "blue":
        return "blue";
      case "red":
        return "red";
      case "green":
        return "green";
      case "yellow":
        return "yellow";
      default:
        return "blue";
    }
  }

  function getEventStatus(color: string) {
    switch (color) {
      case "blue":
        return "primary";
      case "red":
        return "danger";
      case "green":
        return "success";
      case "yellow":
        return "warning";
      default:
        return "default";
    }
  }

  const getButtonVariant = (color: string) => {
    switch (color) {
      case "blue":
        return "default";
      case "red":
        return "destructive";
      case "green":
        return "success";
      case "yellow":
        return "warning";
      default:
        return "default";
    }
  };

  const onSubmit: SubmitHandler<EventFormData> = (formData) => {
    const newEvent: Event = {
      id: uuidv4(),
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      color: formData.color,
      description: formData.description,
      isAllDay: formData.isAllDay,
      type: formData.type,
    };

    if (!typedData?.default?.id) handlers.handleAddEvent(newEvent);
    else handlers.handleUpdateEvent(newEvent, typedData.default.id);
    setClose(); // Close the modal after submission
  };

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
      {CustomAddEventModal ? (
        <CustomAddEventModal register={register} errors={errors} />
      ) : (
        <>
          <div className="grid gap-2">
            <Label htmlFor="title">Event Name</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter event name"
              className={cn(errors.title && "border-red-500")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">
                {errors.title.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter event description"
            />
          </div>

          <SelectDate
            data={{
              startDate: data?.default?.startDate || new Date(),
              endDate: data?.default?.endDate || new Date(),
            }}
            setValue={setValue}
          />

          <div className="grid gap-2">
            <Label>Color</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="w-fit my-2"
                >
                  {
                    colorOptions.find((color) => color.key === selectedColor)
                      ?.name
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {colorOptions.map((color) => (
                  <DropdownMenuItem
                    key={color.key}
                    onClick={() => {
                      setSelectedColor(color.key);
                      setValue("color", color.key);
                    }}
                  >
                    <div className="flex items-center">
                      <div
                        style={{
                          backgroundColor: `var(--${color.key})`,
                        }}
                        className={`w-4 h-4 rounded-full mr-2`}
                      />
                      {color.name}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex justify-end space-x-2 mt-4 pt-2 border-t">
            <Button variant="outline" type="button" onClick={() => setClose()}>
              Cancel
            </Button>
            <Button type="submit">Save Event</Button>
          </div>
        </>
      )}
    </form>
  );
}
