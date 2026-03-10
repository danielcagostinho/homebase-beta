"use client";

import { CalendarView } from "@/features/calendar/components/calendar-view";

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="heading-md text-foreground">Calendar</h2>
        <p className="body text-muted-foreground">
          View your tasks on a calendar.
        </p>
      </div>

      <CalendarView />
    </div>
  );
}
