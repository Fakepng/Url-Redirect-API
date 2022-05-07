const express = require('express');
const router = express.Router();

const stringToTime = require('@fakepng/string-to-time');

const DB = require('../models/shortlink');

const ADDRESS = process.env.ADDRESS;

const deathLine = (time) => {
    const {years, months, weeks, days, hours, minutes, seconds} = time;
    let date = new Date();
    date.setFullYear(date.getFullYear() + years);
    date.setMonth(date.getMonth() + months);
    date.setDate(date.getDate() + (weeks * 7));
    date.setDate(date.getDate() + days);
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);
    date.setSeconds(date.getSeconds() + seconds);
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
        
        await DB.create({ name, link, useDeathLine, deathLine: deathLine(stringToTime(time)) });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
    res.status(201).send(`Visit your link at: ${ADDRESS}${name}`);
});

module.exports = router;