import axios from "axios";

import { TeamupConfig } from "../interfaces/teamup/teamupConfig";

// Sends a GET request to teamup for the current calendar
export async function getCalendar(teamupConfig : TeamupConfig, startDate : Date, endDate : Date) {
    let startSyntax = `${startDate.getUTCFullYear()}-${startDate.getUTCMonth() + 1}-${startDate.getUTCDate()}`;
    let endSyntax = `${endDate.getUTCFullYear()}-${endDate.getUTCMonth() + 1}-${endDate.getUTCDate()}`;

    // API Url
    let url = `https://api.teamup.com/ksdhpfjcouprnauwda/events?startDate=${startSyntax}&endDate=${endSyntax}`;
    const res = await axios.get(url, {
        headers: {
            "Teamup-Token": teamupConfig.APIKey
        }
    }).catch(err => {
        console.log(err);
    });

    return res;
}