import chalk from "chalk";

import { Crunchyroll, DefaultStreamingService, Funimation, HiDive, HomeVideo, Netflix } from "../constants/StreamingServices";
import { CalendarItem } from "../interfaces/calendarItem";
import { Platform } from "../interfaces/platform";
import { ReleaseTime } from "../interfaces/releaseTime";
import { Show } from "../interfaces/show";
import { StreamingService } from "../interfaces/streamingService";
import { TeamupCalendar } from "../interfaces/teamup/teamupCalendar";
import { TeamupShow } from "../interfaces/teamup/teamupShow";

import { createShow, deleteAllShows, findShow } from "../services/showService";
import { getShow } from "../utils/anilistAPI";

import { AnilistShow } from "../interfaces/anilist/anilistShow";
import { ShowDate } from "../interfaces/showDate";

// Creates the calendar from the teamup information
export async function processCalendar(calendar : TeamupCalendar) : Promise<CalendarItem[]> {
    // Shorten the show's title then check if the show is already in the database
    // We only want to store the show once (Show Image, Location)
    // The calendar info will be stored separately.
    let showCalendar : CalendarItem[] = [];
    for (let i = 0; i < calendar.events.length; i++) {
        let calItem = getCalendarItem(calendar.events[i]);;

        // Database check
        let show : Show = await findShow({ name: calItem.show.name });
        if (show != null) {
            calItem.show = show;
            showCalendar.push(calItem);
        } else {
            // Get Anilist ID and image
            const anilistShow : AnilistShow = await getShow(calItem);

            calItem.show.anilistID = anilistShow.id;
            calItem.show.image = anilistShow.coverImage;

            // Add show to the database
            await createShow(calItem.show);

            showCalendar.push(calItem);
        }
        
    }
    

    return showCalendar;
}

// Shortens the show's teamup title to it's CalendarItem equivalent
// Extracts the show's base name, season, episode number/batch, and release time
function getCalendarItem(item: TeamupShow) : CalendarItem {
    // Parse the title and get it's cut down name and if it's a movie
    let show = getShowTitle(item.title);

    show.platforms = getShowPlatforms(item);

    let episodeAndSeason = getShowEpisodeAndSeason(item.title);

    let time = getShowReleaseTime(item.start_dt);

    let calItem : CalendarItem = {
        show: show,
        season: episodeAndSeason.season,
        episode: episodeAndSeason.episode,
        episodeBatch: episodeAndSeason.batch,
        time: time,
    }

    return calItem;
}

// Parses the teamup title to get just the show's name and whether or not it's a movie
// (Movie checking in done to help with title parsing)
function getShowTitle(title: string) : Show {
    // Handle titles with prefix characters
    // (Otherwise, the regex will not execute properly
    // and leave the whole title in tact instead of cutting off
    // the episode)
    if (title.includes("Currently Delayed")) {
        title = title.substring(title.indexOf("Currently Delayed)") + 18);
    }
    else if (title.includes("SUBJECT TO CHANGE")) {
        title = title.substring(title.indexOf("SUBJECT TO CHANGE") + 18);
    }

    let match = /[A-Za-z]/.exec(title);
    let endOfTitle = title.indexOf('|');
    if (endOfTitle == -1) endOfTitle = title.length + 1;
    
    let showName = (title.substring(match.index, endOfTitle - 1)).trim();

    // Special Cases
    let isMovie = false;
    if (showName.includes("Movies")) {
        showName = showName.substring(showName.indexOf("Movie") + 8);
        isMovie = true;
    }
    else if (showName.includes("Movie")) {
        showName = showName.substring(showName.indexOf("Movie") + 7);
        isMovie = true;
    }
    else if (showName.includes("Unconfirmed")) {
        showName = showName.substring(showName.indexOf("Unconfirmed" + 13));
    }
    else if (showName.includes("- OVAs")) {
        showName = showName.substring(0, showName.indexOf("- OVAs") - 1);
    } 
    else if (showName.includes("Finale")) {
        showName = showName.substring(0, showName.indexOf("Finale") - 1);
    }

    return {
        name: showName,
        image: null,
        anilistID: null,
        movie: isMovie,
        platforms: []
    };
}

function getShowPlatforms(item: TeamupShow) : Platform[] {
    let streamingServices = getShowServices(item.subcalendar_ids);
    let platforms : Platform[] = [];
    for (let i = 0; i < streamingServices.length; i++) {
        platforms.push({
            streamingService: streamingServices[i],
            link: "#",
        });
    }

    return platforms;
}

function getShowServices(calendarIDs: number[]) : StreamingService[] {
    let services : StreamingService[] = [];
    for (let i = 0; i < calendarIDs.length; i++) {
        if (calendarIDs[i] == 9409028) services.push(Funimation);       // Funimation 
        else if (calendarIDs[i] == 9244632) services.push(Crunchyroll); // Crunchyroll
        else if (calendarIDs[i] == 9244626) services.push(HiDive);      // HiDive
        else if (calendarIDs[i] == 9265431) services.push(Netflix);     // Netflix
        else if (calendarIDs[i] == 9805490) services.push(DefaultStreamingService); // Other
        else if(calendarIDs[i] == 9856401) services.push(HomeVideo);    // Home-Video only
        else console.log(`UNKNOWN: Calendar ID: ${calendarIDs[i]}`);
    }

    return services;
}

interface EpisodeAndSeason {
    episode: string,
    season: number,
    batch: boolean
};
function getShowEpisodeAndSeason(title: string) : EpisodeAndSeason {
    let episode;
    let season = 1;
    let isBatch = false;

    // Gets the section of the string with the episode and season
    let section = title.substring(title.indexOf('#') + 1, title.length);
    let episodePart = section.substring(0, section.indexOf(' '));
    if (episodePart != null) {
        if (/[0-9]/.exec(episodePart) == null) {
            isBatch = true;
            episode = "Batch";
        }
        else {
            episode = episodePart;
            if (episodePart.includes('-')) isBatch = true;
        }
    }
    else isBatch = true;

    let seasonRegEx = /Season /.exec(title);
    if (seasonRegEx != null) {
        let seasonText = title.substring(seasonRegEx.index);
        let seasonPart = /[0-9]/.exec(seasonText);
        if (seasonPart != null) season = parseInt(seasonPart[0]);
    }

    return {
        episode: episode,
        season: season,
        batch: isBatch,
    }
}

// Returns the day and time of release (in UTC)
function getShowReleaseTime(time: string) : ReleaseTime {
    let releaseTime = new Date(time);
    return {
        year: releaseTime.getUTCFullYear(),
        month: releaseTime.getUTCMonth(),
        day: releaseTime.getUTCDate(),
        hour: releaseTime.getUTCHours(),
        minute: releaseTime.getUTCMinutes()
    }
}