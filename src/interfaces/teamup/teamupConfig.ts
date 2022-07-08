import { Time } from "../time";

export interface TeamupConfig {
    APIKey: string;
    startTime: Time;
    endTime: Time;
    updateStartTime: Time;
    updateEndTime: Time;
}