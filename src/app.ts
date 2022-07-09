import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "dotenv";
env.config();

import { CalendarRetrieval } from "./calendar/calendarRetrieval";

// Connect to database
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

console.log(process.env.DATABASE_URL);

db.on("erorr", (err) => console.log(err));
db.once("open", () => console.log("Connected to database!"));

const calendar = new CalendarRetrieval();

const app = express();
const port = process.env.PORT || 3001;

const whitelist = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:80", "http://127.0.0.1:80"]
const corsOptions = {
    origin: function(origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
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

app.listen(port, async () => {
    console.log(`Listening at http://localhost:${port}`);
    await calendar.update();
    setInterval(async () => {await calendar.update(); }, 900000);
});