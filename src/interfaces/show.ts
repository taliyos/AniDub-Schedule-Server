import { Platform } from "./platform";
import { ReleaseTime } from "./releaseTime";

// The representation for a show and its properties

export interface Show {
    // Show Name
    name: string;
    // Cover/key art
    image: string;
    // AniList ID
    anilistID: number;
    // Movie or Series
    movie: boolean | false;
    // Platforms
    platforms: Platform[];
}