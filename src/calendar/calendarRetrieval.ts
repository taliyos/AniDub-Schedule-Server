import { promises } from "fs";
import { AxiosResponse } from "axios";
import chalk from "chalk";

// Interfaces
import { ShowDate } from "../interfaces/showDate";
import { TeamupConfig } from "../interfaces/teamup/teamupConfig";
import { TeamupCalendar } from "../interfaces/teamup/teamupCalendar";

import { getCalendar } from "../utils/teamupAPI";

import { processCalendar } from "./calendarProcessing";
import { CalendarItem } from "../interfaces/calendarItem";

export class CalendarRetrieval {
    archiveCalendar : CalendarItem[];
    currentCalendar : CalendarItem[];
    lastRetrieved : Date | null;

    private teamupConfig : TeamupConfig;

    private async loadConfig() {
        const data = JSON.parse(await promises.readFile("./src/settings/teamup.json", "utf-8")) as TeamupConfig;
        this.teamupConfig = data as TeamupConfig;
    }

    // Performs an update to the entire calendar
    async update() {
        if (this.teamupConfig == null || this.teamupConfig.APIKey === "") await this.loadConfig();
        const retrievalTime = new Date();
        if (this.archiveCalendar == null) {
            const archiveCalendar = await this.fetchArchiveCalendar();
            this.archiveCalendar = await processCalendar(archiveCalendar);
        }
        const calendar = await this.fetchCalendar();
        // Check if the new calendar has been updated since the last successful retrieval
        if (this.isOldCalendar(calendar)) return;

        this.currentCalendar = (await processCalendar(calendar)).concat(this.archiveCalendar);
        this.lastRetrieved = retrievalTime;
    }

    // Retrieves the calendar from TeamUp
    private async fetchCalendar() : Promise<TeamupCalendar> {
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

        const response = await getCalendar(this.teamupConfig, startDate, endDate);

        const calendar = (response as AxiosResponse).data as TeamupCalendar;
        return calendar;
    }

    // Gets older dates in the calendar that are unlikely to be updated
    // This is separated to make the update requests much smaller
    private async fetchArchiveCalendar() : Promise<TeamupCalendar>{
        // Set the start date
        let startDate = new Date();
        startDate.setUTCFullYear(startDate.getUTCFullYear() + this.teamupConfig.updateStartTime.year,
                                startDate.getUTCMonth() + this.teamupConfig.updateStartTime.month,
                                startDate.getUTCDate() + this.teamupConfig.updateStartTime.day);

        // Set the end date
        let endDate = new Date();
        endDate.setUTCFullYear(endDate.getUTCFullYear() + this.teamupConfig.updateEndTime.year,
                                endDate.getUTCMonth() + this.teamupConfig.updateEndTime.month,
                                endDate.getUTCDate() + this.teamupConfig.updateEndTime.day);

        const response = await getCalendar(this.teamupConfig, startDate, endDate);

        const calendar = (response as AxiosResponse).data as TeamupCalendar;
        return calendar;
    }

    // Checks if the calendar has been updated since the last retrieval
    private isOldCalendar(calendar : TeamupCalendar) : boolean {
        if (this.lastRetrieved == null || this.currentCalendar == null) return false;
        for (let i = 0; i < calendar.events.length; i++) {
            if (new Date(calendar.events[i].update_dt) > this.lastRetrieved) return false;
        }
        console.log(chalk.yellowBright("Calendar is old, not updating..."));
        return true;
    }

    getCalendar(startDate : Date, endDate: Date) : CalendarItem[] {
        if (this.currentCalendar == null) return null;
        if (startDate > endDate) return null;
        let startIndex = 0;
        let endIndex = this.currentCalendar.length - 1;
        for (let i = 0; i < this.currentCalendar.length; i++) {
            if (this.currentCalendar[i].time.year >= startDate.getUTCFullYear()
                && this.currentCalendar[i].time.month >= startDate.getUTCMonth()
                && this.currentCalendar[i].time.day >= startDate.getUTCDate()
            ) {
                startIndex = i;
                break;
            }
        }

        for (let i = this.currentCalendar.length - 1; i >= 0; i--) {
            if (this.currentCalendar[i].time.year <= endDate.getUTCFullYear()
                && this.currentCalendar[i].time.month <= endDate.getUTCMonth()
                && this.currentCalendar[i].time.day <= endDate.getUTCDate()
            ) {
                endIndex = i;
                break;
            }
        }

        let constructedCalendar : CalendarItem[] = [];
        for (let i = startIndex; i <= endIndex; i++) {
            constructedCalendar.push(this.currentCalendar[i]);
        }
        return constructedCalendar;
    }

}