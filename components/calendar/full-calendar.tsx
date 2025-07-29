import SchedulerWrapper from "./schedule/_components/wrapper/schedular-wrapper"

export default function StyledFullCalendar() {
    return (
        <div className="flex flex-col gap-6 p-2">
            <SchedulerWrapper />
        </div>
    );
}