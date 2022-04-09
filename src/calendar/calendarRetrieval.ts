import { promises } from "fs";
import { AxiosResponse } from "axios";

// Interfaces
import { ShowDate } from "../interfaces/showDate";
import { TeamupConfig } from "../interfaces/teamup/teamupConfig";
import { TeamupCalendar } from "../interfaces/teamup/teamupCalendar";

import { getCalendar } from "../utils/teamupAPI";

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
        this.processCalendar(calendar);

    }

    // Creates the calendar from the teamup information
    private async processCalendar(calendar : TeamupCalendar) {
        for (let i = 0; i < calendar.events.length; i++) {
            let show = 
        }
    }


    // Retrieves the calendar from TeamUp
    private async fetchCalendar() {
        // Set the start date
        let startDate = new Date();
        startDate.setUTCFullYear(startDate.getUTCFullYear() + this.teamupConfig.startTime.year,
                                startDate.getUTCMonth() + this.teamupConfig.startTime.month,
                                startDate.getUTCDate() + this.teamupConfig.startTime.day);

        // Set the end date
        let endDate = new Date();
        endDate.setUTCFullYear(endDate.getUTCFullYear() + this.teamupConfig.endTime.year,
                                endDate.getUTCMonth() + this.teamupConfig.endTime.month,
                                endDate.getUTCDate() + this.teamupConfig.endTime.day);

        const response = await getCalendar(this.teamupConfig, startDate, endDate)

        const calendar = (response as AxiosResponse).data as TeamupCalendar;
        return calendar;
    }

}