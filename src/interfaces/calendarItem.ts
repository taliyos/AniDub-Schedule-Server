import { Platform } from "./platform";
import { ReleaseTime } from "./releaseTime";
import { Show } from "./show";

// The representation for a show episode/movie (The Calendar Item)

export interface CalendarItem {
    show: Show;
    // Season #
    season: number | 0;
    // Episode #
    episode: number | 0;
    // Episode Batch
    episodeBatch: boolean | false;
    // Release Time
    time: ReleaseTime;
}