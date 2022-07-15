import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "dotenv";
import https from "https";
import { promises, readFileSync } from "fs";
env.config();

import { CalendarRetrieval } from "./calendar/calendarRetrieval";
import ServerSettings from "./interfaces/serverSettings";

// Connect to database
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;



db.on("erorr", (err) => console.log(err));
db.once("open", () => console.log("Connected to database!"));

const calendar = new CalendarRetrieval();

const app = express();
const port = process.env.PORT || 3001;

const settings = loadSettings();
console.log(settings.whitelist);
const corsOptions = {
    origin: function(origin, callback) {
        if (!origin || settings.whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}
app.use(cors(corsOptions));
app.use(express.json());

app.post("/calendar", (req, res) => {
    if (calendar.currentCalendar == null) {
        res.status(503).json("Server starting... Try again.");
        return;
    }
    if (req.body.startDate == null || req.body.endDate == null) {
        res.json(calendar.currentCalendar);
        return;
    }
    let startDate = new Date(req.body.startDate);
    let endDate = new Date(req.body.endDate);
    let constructedCalendar = calendar.getCalendar(startDate, endDate);
    if (constructedCalendar == null) {
        res.status(400).json("Invalid start and end dates");
        return;
    }
    res.json(constructedCalendar);
});

if (process.env.USE_HTTPS) {
    const httpsOptions = {
        cert: readFileSync(settings.cert, "utf-8"),
        key: readFileSync(settings.key, "utf-8")
    }

    https.createServer(httpsOptions, app).listen(3002);
}

app.listen(port, async () => {
    console.log(`Listening at http://localhost:${port}`);
    await calendar.update();
    setInterval(async () => {await calendar.update(); }, settings.updateRate);
});

function loadSettings() : ServerSettings {
    return (JSON.parse(readFileSync("./src/settings/serverSettings.json", "utf-8")) as ServerSettings);
}