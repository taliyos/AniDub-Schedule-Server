import { StreamingService } from "./streamingService";

// Basic reference for the makeup of a platform

export interface Platform {
    // The streaming service used
    streamingService: StreamingService;
    // URL to watch episode
    link: string;
}