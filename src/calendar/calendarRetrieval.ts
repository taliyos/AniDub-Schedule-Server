import { promises } from "fs";
import axios, { AxiosResponse, HeadersDefaults } from "axios";

import { ShowDate } from "../interfaces/showDate";
import { TeamupConfig } from "../interfaces/teamupConfig";

interface TeamupHeader extends HeadersDefaults {
    "Teamup-Token": string;
}

export class CalendarRetrieval {
    
    currentCalendar : ShowDate[];

    private teamupConfig : TeamupConfig;

    constructor() {
    }

    private async loadConfig() {
        const data = JSON.parse(await promises.readFile("./src/settings/teamup.json", "utf-8")) as TeamupConfig;
        this.teamupConfig = data as TeamupConfig;
    }

    // Performs an update to the entire calendar
    async update() {
        if (this.teamupConfig == null || this.teamupConfig.APIKey === "") await this.loadConfig();

        const calendar = await this.fetchCalendar();
    }

    private async getShows() {
        
    }


    // Retrieves the calendar from TeamUp
    private async fetchCalendar() {
        let startDate = new Date();

        // Set the start date to 7 days in the past
        startDate.setUTCFullYear(startDate.getUTCFullYear() + this.teamupConfig.startTime.year,
        startDate.getUTCMonth() + this.teamupConfig.startTime.month,
        startDate.getUTCDate() + this.teamupConfig.startTime.day);
        let startSyntax = `${startDate.getUTCFullYear()}-${startDate.getUTCMonth() + 1}-${startDate.getUTCDate()}`;

        // Set the end date to to 2 months in the future
        let endDate = new Date();
        endDate.setUTCFullYear(endDate.getUTCFullYear() + this.teamupConfig.endTime.year,
                                endDate.getUTCMonth() + this.teamupConfig.endTime.month,
                                endDate.getUTCDate() + this.teamupConfig.endTime.day);
        let endSyntax = `${endDate.getUTCFullYear()}-${endDate.getUTCMonth() + 1}-${endDate.getUTCDate()}`;

        // API Url
        let url = `https://api.teamup.com/ksdhpfjcouprnauwda/events?startDate=${startSyntax}&endDate=${endSyntax}`;

        const res = await axios.get(url, {
            headers: {
                "Teamup-Token": this.teamupConfig.APIKey
            }
        }).catch(err => {
            console.log(err);
        });

        const data = (res as AxiosResponse).data;

        console.log(data);

        
    }

}