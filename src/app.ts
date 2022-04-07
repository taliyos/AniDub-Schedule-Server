import express from "express";
import cors from "cors";

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

app.get("/calendar", (req, res) => {
    res.send("Here's the calendar!");
});

app.listen(port, async () => {
    return console.log(`Listening at http://localhost:${port}`);
});