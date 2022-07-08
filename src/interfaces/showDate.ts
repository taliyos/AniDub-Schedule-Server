import { CalendarItem } from "./calendarItem";

// The representation for a date row. This includes the shows
// that air on the day
export interface ShowDate {
    // Release Year
    year: number | 0;
    // Release Month
    month: number | 0;
    // Release Day
    day: number | 1;
    // Calendar Items
    calendarItems: CalendarItem[];
}