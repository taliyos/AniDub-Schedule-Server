import chalk from "chalk";

import { ShowModel } from "../models/showDB";

export async function createShow(show) {
    let result = await ShowModel.create(show);
    if (result != null) console.log("Added " + chalk.greenBright(show.name) + " to the database");
    else console.warn(chalk.bgRedBright.black("Unable to add " + show.name + " to the database"));
    return result;
}

export async function findShow(query, options = { lean: true }) {
    let result = await ShowModel.findOne(query, null, options);
    if (result == null) console.log("Could not find " + chalk.yellowBright(query.name) + " in the database");
    else console.log("Found " + chalk.blueBright(query.name) + " in the database");
    return result;
}

export async function deleteAllShows() {
    await ShowModel.deleteMany({});
    console.log(chalk.redBright("Deleted all shows from the database"));
}