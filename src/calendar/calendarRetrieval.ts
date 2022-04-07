import { promises } from "fs";
import axios, { HeadersDefaults } from "axios";

import { ShowDate } from "../interfaces/showDate";
import { TeamupConfig } from "../interfaces/teamupConfig";

interface TeamupHeader extends HeadersDefaults {
    "Teamup-Token": string;
}

export class CalendarRetrieval {
    
    currentCalendar : ShowDate[];

    private teamupHeader: TeamupHeader;
    private teamupKey : string = "";

    constructor() {
    }

    private async loadConfig() {
        const data = JSON.parse(await promises.readFile("./src/settings/teamup.json", "utf-8")) as TeamupConfig;
        this.teamupKey = data.APIKey;
        //this.teamupHeader["Teamup-Token"] = data.APIKey;
    }

    // Performs an update to the entire calendar
    async update() {
        if (this.teamupKey == "") await this.loadConfig();

        const shows = this.getShows();
    }

    private async getShows() {
        let today = new Date();
        let calStartDate = new Date();

        // Set the start date to 7 days in the past
        calStartDate.setDate(calStartDate.getDate() - 7);
        let startSyntax = `${calStartDate.getUTCFullYear()}-${calStartDate.getUTCMonth() + 1}-${calStartDate.getUTCDate()}`;

        // Set the end date to to 2 months in the future
        let endDate = new Date();
        endDate.setUTCMonth(today.getUTCMonth() + 1);
        let endSyntax = `${endDate.getUTCFullYear()}-${endDate.getUTCMonth() + 1}-${endDate.getUTCDate()}`;

        // API Url
        let url = `https://api.teamup.com/ksdhpfjcouprnauwda/events?startDate=${startSyntax}&endDate=${endSyntax}`;

        let start = `${calStartDate.getUTCFullYear()}-${calStartDate.getUTCMonth() + 1}-${calStartDate.getUTCDate()}`;

        const res = await axios.get(url, {
            headers: {
                "Teamup-Token": this.teamupKey
            }
        }).catch(err => {
            console.log(err);
        });

        console.log(res);
    }

}