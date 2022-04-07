import { Platform } from "./platform";
import { ReleaseTime } from "./releaseTime";

// The representation for a show and all its contents

export interface Show {
    // Show Name
    name: string;
    // Cover/key art
    image: string;
    // AniList ID
    anilistID: number;
    // Season #
    season: number | 0;
    // Episode #
    episode: number | 0;
    // Movie or Series
    movie: boolean | false;
    // Episode Batch
    episodeBatch: boolean | false;
    // Platforms
    platforms: Platform[];
    // Release Time
    time: ReleaseTime;
}