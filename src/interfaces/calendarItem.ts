import { Platform } from "./platform";
import { ReleaseTime } from "./releaseTime";
import { Show } from "./show";

// The representation for a show episode/movie (The Calendar Item)

export interface CalendarItem {
    show: Show;
    // Episode #
    episode: string | "";
    // Episode Batch
    episodeBatch: boolean | false;
    // Release Time
    time: ReleaseTime;
}