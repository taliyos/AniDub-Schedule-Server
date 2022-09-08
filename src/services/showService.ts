/**
 * showService.ts is responsible for providing the communication between the mongo database
 * and the server.
 */

import chalk from "chalk";

import { ShowModel } from "../models/showDB";

export async function createShow(show) {
    let result = await ShowModel.create(show);
    if (result != null) console.log("Added " + chalk.greenBright(show.name) + " to the database");
    else console.warn(chalk.bgRedBright.black("Unable to add " + show.name + " to the database"));
    return result;
}

export async function findShow(query, addSeason = true, options = { lean: true }) {
    let result = await ShowModel.findOne(query, null, options);
    if (result == null) {
        console.log("Could not find " + chalk.yellowBright(query.name) + " in the database");
        if (!addSeason) return null;

        // Try to append field to an existing entry without a season
        // This is a compatability step to ensure that old database entries
        // remain compatible with old ones (w/o the season)
        let nameOnlyResult = await findShow({ name: query.name }, false);
        if (nameOnlyResult != null && nameOnlyResult.season == undefined) {
            console.log(chalk.blueBright("Show database entry is from an old version, adding season"));
            let seasonFillResult = await addSeasonEntry(nameOnlyResult, query.season);
            if (seasonFillResult.modifiedCount == 1) return nameOnlyResult;
        }
    }
    else console.log("Found " + chalk.blueBright(query.name) + " in the database");
    return result;
}

export async function deleteAllShows() {
    await ShowModel.deleteMany({});
    console.log(chalk.redBright("Deleted all shows from the database"));
}

export async function addSeasonEntry(show, season) {
    let result = await ShowModel.updateOne(show, {$set: {"season": season}});
    if (result.modifiedCount == 0) console.log(chalk.redBright("Failed to add season field to " + show.name));
    else console.log(chalk.greenBright("Successfully added season field to " + show.name));
    console.log(result);
    return result;
}