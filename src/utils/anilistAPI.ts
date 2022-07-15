import axios from "axios";
import chalk from "chalk";

import { AnilistAPI } from "../interfaces/anilist/anilistConfig";
import { query } from "../constants/AnilistQuery";
import { CalendarItem } from "../interfaces/calendarItem";

export async function getShow(calItem: CalendarItem) {
    console.log("Searching for " + chalk.blueBright(calItem.show.name) + "...");
    const variables = {
        search: calItem.show.name,
        page: 1,
        perPage: 5
    };

    const response = await axios({
        url: AnilistAPI,
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        data: {
            "operationName": "fetchShow",
            "query": query,
            "variables": variables
        }
    }).catch(async (err) => {
        if (err.response.status == 429) {
            console.warn("Too many requests to AniList, waiting...");
            await sleep(10000);
            const result = await getShow(calItem);
            return result;
        }
        else if (err.response.status == 404) {
            console.error(chalk.bgRedBright("404 Error"));
            return undefined;
        } 
        else if (err.response.status == 500) {
            console.error(chalk.bgRedBright("Internal Server Error...") + err);
            return undefined;
        }
        else {
            console.error(err);
        }
    });

    if (response.data == null || response.data.data.Page.media == null || response.data.data.Page.media.length == 0) {
        console.log(response);
        console.warn(chalk.redBright("Couldn't find " + chalk.bold(calItem.show.name) + " on AniList, using defaults"));
        return {
            id: 0,
            coverImage: "/img/nocover.png",
            externalLinks: null
        }
    }

    let media = response.data.data.Page.media;

    // Find the correct season through episode counting
    let episodeCounter = calItem.episode;
    let index = 0;
    /* Old method for looking for the correct season
    while (media[index] != undefined && media[index].episodes != null 
        && episodeCounter > media[index].episodes) {
        
        console.log("Looking for season...");
        episodeCounter -= media[index].episodes;
        index++;
    }*/

    if (calItem.season != 1) {
        if (calItem.season - 1 < media.length) index = calItem.season - 1;
    }
    else if (!media[0].title.romaji.toLowerCase().includes(calItem.show.name.toLowerCase()) && (media[0].title.english != null && !media[0].title.english.toLowerCase().includes(calItem.show.name.toLowerCase()))) {
        console.log(chalk.yellowBright("First entry doesn't use the same name, searching..."));
        for (let i = 1; i < media.length; i++) {
            console.log("Checking " + chalk.yellowBright(media[i].title.romaji + "/" + media[i].title.english) + " against " + chalk.yellowBright(calItem.show.name));
            if (media[i].title.romaji.toLowerCase().includes(calItem.show.name.toLowerCase()) || (media[i].title.english != null && media[i].title.english.toLowerCase().includes(calItem.show.name.toLowerCase()))) {
                console.log(chalk.yellowBright("Valid entry found!"));
                index = i;
                break;
            }
        }
    }

    // Currently, nothing is done with the show's title
    // In the future, both the english and romaji names should be passed on
    // for customizability on the website
    if (media[index] == null) {
        console.log(chalk.redBright("Could not find " + calItem.show.name + " on AniList, using defaults"));
        return {
            id: 0,
            coverImage: "/img/nocover.png",
            externalLinks: null
        }
    }

    console.log("Search for " + chalk.blueBright(calItem.show.name) + " complete!")
    return {
        id: media[index].id,
        coverImage: media[index].coverImage.extraLarge,
        externalLinks: media[index].externalLinks
    };
}

function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}