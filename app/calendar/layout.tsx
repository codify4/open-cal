import { CalendarLayoutClient } from "@/components/wrappers/calendar-layout-client"

export const metadata = {
    title: "OpenCal",
    description: "An Open Source AI alternative to Google Calendar.",
}

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
    return <CalendarLayoutClient>{children}</CalendarLayoutClient>
}