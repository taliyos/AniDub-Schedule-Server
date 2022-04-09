import { TeamupShow } from "./teamupShow";

// The interface representation for the data retreived through the Teamup API
export interface TeamupCalendar {
    events: TeamupShow[];
}