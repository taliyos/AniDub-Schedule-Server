// Representation for the data given in a teamup calendar request (per-show)

export interface TeamupShow {
    // ID of calendar item
    id: string;
    // Not used
    series_id?: string;
    // Not used
    remote_id?: string;
    // Which subcalendar the item is on
    // This will correspond to which streaming service has the show
    subcalendar_id: number;
    subcalendar_ids: number[];
    // Identifier for how long the "event" is
    all_day: boolean;
    // Not used
    rrule?: string;
    // Calendar Item Title, will be the title of the anime
    title: string;
    // Not used
    location?: string;
    // Not used
    who?: string;
    // Any accompanying notes, typically includes a show image
    notes?: string;
    // Not used
    version?: string;
    // Whether or not the calendar item can be modified
    readonly: boolean;
    // Not used
    tz: any;
    // Not used
    attachments: any[];
    // Anime Air Date
    start_dt: string;
    // Anime End Date
    end_dt: string;
    // Not used
    ristart_dt?: string;
    // Date of creation for the calendar item
    creation_dt: string;
    // Date of deletion for the calendar item
    delete_dt?: string;
    // Not used
    custom: any;
}