import { Show } from "./show";

// The representation for a date row. This includes the shows
// that air on the day
export interface ShowDate {
    // Release Month
    month: number | 0;
    // Release Day
    day: number | 1;
    // Day of Week
    dayOfWeek: string | "Sunday";
    // Shows
    shows: Show[];
}