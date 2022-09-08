# AniDub-Schedule-Server

## Overview
This is the server for pulling and storing information from the community maintained Anime Dub Calendar. This calendar includes information on the release date and time of new English Dubbed anime episodes as well as additional information (streaming link, key art, etc.) pulled from AniList. Used in conjunction with Anime-Schedule-React, a graphical calendar of the upcoming dubbed anime episodes is created.

Live at [talios.software](https://talios.software)

## History
This started as a small project around the start of the COVID-19 pandemic. I wanted a way to quickly check when shows were about to be released in a more comprehensive format. That version was personal only and had a lot of issues. Then there was the next version which was a step up, but still had some issues. This versions aims to fill the gaps left by the earlier version while being simple to maintain.

## Features
 - Calendar information pulled from TeamUp ([Here's the calendar](https://teamup.com/ksdhpfjcouprnauwda))
 - Parsing and requesting shows from AniList
 - Storage of shows in cache
 - Long-term show storage in mongo database

## Future Features
 - AniList Integration
 - Show Filtering

## Setup and Use
This project runs on Node v16.9.1. To setup the dependencies, simply run
```
npm install
```
 in the project.

Inside `settings/`, there are three configuration files which determine API Keys, update frequencies, and calendar ranges. These must be configured for the project to work.

### teamup.json
Here's the base file for `teamup.json`. The API Key is retrieved from [TeamUp](https://teamup.com/api-keys/request). The calendar works by using two retrievals. The range specified by `startTime` and `endTime` is only updated once per day while `updateStartTime` and `updateEndTime` is updated multiple times per day (as set in `serverSettings.json`).
```
{
    "APIKey": "",
    "startTime": {
        "year": 0,
        "month": -6,
        "day": 0
    },
    "endTime": {
        "year": 0,
        "month": 0,
        "day": -4
    },
    "updateStartTime": {
        "year": 0,
        "month": 0,
        "day": -3
    },
    "updateEndTime": {
        "year": 0,
        "month": 1,
        "day": 0
    }
}
```

### anilist.json
Request an API Key on [AniList](https://anilist.co).
```
{
    "APIKey": ""
}
```

### serverSettings.json
This file contains the CORS whitelist, the rate the calendar updates, and the https credentials (cert and key). Without the https credentials, the server will run in HTTP mode. `updateRate` is an integer specified in miliseconds. In this case 900000ms is equal to one calendar update every 15 minutes.
```
{
    "whitelist": [
    ],
    "updateRate": 900000,
    "cert": "",
    "key": ""
}
```