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
const port = 3001;

const whitelist = ["http://localhost:3000", "http://127.0.0.1:3000"]
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

app.get("/calendar", (req, res) => {
    res.send("Here's the calendar!");
});

app.listen(port, async () => {
    console.log(`Listening at http://localhost:${port}`);
    await calendar.update();
});