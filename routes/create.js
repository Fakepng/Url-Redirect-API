const express = require('express');
const router = express.Router();

const DB = require('../models/shortlink');

const ADDRESS = process.env.ADDRESS;

const textToDate = (time) => {
    const Year = parseInt(time.substring(0, time.indexOf('Y'))) || 0;
    const Month = time.indexOf('M') !== -1 ? parseInt(time.substring(time.indexOf('Y') + 1, time.indexOf('M'))) : 0;
    const Week = time.indexOf('W') !== -1 ? parseInt(time.substring(time.indexOf('M') + 1, time.indexOf('W'))) : 0;
    const Day = time.indexOf('D') !== -1 ? parseInt(time.substring(time.indexOf('W') + 1, time.indexOf('D'))) : 0;
    const Hour = time.indexOf('h') !== -1 ? parseInt(time.substring(time.indexOf('D') + 1, time.indexOf('h'))) : 0;
    const Minute = time.indexOf('m') !== -1 ? parseInt(time.substring(time.indexOf('h') + 1, time.indexOf('m'))) : 0;
    const Second = time.indexOf('s') !== -1 ? parseInt(time.substring(time.indexOf('m') + 1, time.indexOf('s'))) : 0;
    return {Year, Month, Week, Day, Hour, Minute, Second};
}

const deathLine = (time) => {
    const {Year, Month, Week, Day, Hour, Minute, Second} = time;
    let date = new Date();
    date.setFullYear(date.getFullYear() + Year);
    date.setMonth(date.getMonth() + Month);
    date.setDate(date.getDate() + (Week * 7));
    date.setDate(date.getDate() + Day);
    date.setHours(date.getHours() + Hour);
    date.setMinutes(date.getMinutes() + Minute);
    date.setSeconds(date.getSeconds() + Second);
    return date;   
}

router.get("/", async (req, res) => {
    const name = req.query.name;
    const link = req.query.link;
    const password = req.query.password;
    const time = req.query.time || '';
    const Forbidden = ['create', 'remove', 'list'];

    if (!(name && link && password)) return res.status(400).send("Bad request");
    if (Forbidden.includes(name.toLowerCase())) return res.status(400).send("Forbidden name");
    if (password !== process.env.PASSWORD) return res.status(401).send("Wrong password");

    try {
        if (await DB.findOne({ name })) return res.status(400).send("Name already exists");

        const useDeathLine = time ? true : false;
        
        await DB.create({ name, link, useDeathLine, deathLine: deathLine(textToDate(time)) });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
    res.status(201).send(`Visit your link at: ${ADDRESS}${name}`);
});

module.exports = router;