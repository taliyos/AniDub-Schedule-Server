import { Schema, model } from "mongoose";
import { Show } from "../interfaces/show";
import { Platform } from "../interfaces/platform";
import { StreamingService } from "../interfaces/streamingService";

const StreamingSchema = new Schema<StreamingService> ({
    name: String
});

const PlatformSchema = new Schema<Platform> ({
    streamingService: { type: StreamingSchema, required: true},
    link: { type: String, required: true }
})

const ShowSchema = new Schema<Show> ({
    name: { type: String, required: true },
    season: { type: Number, required: false },
    image: { type: String, required: false },
    anilistID: { type: Number, required: false },
    movie: { type: Boolean, required: true },
    platforms: { type: [PlatformSchema], required: true }
});

export const ShowModel = model<Show>("Show", ShowSchema);