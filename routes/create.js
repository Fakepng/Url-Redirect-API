const express = require('express');
const router = express.Router();

const DB = require('../models/shortlink');

const ADDRESS = process.env.ADDRESS;

router.get("/", async (req, res) => {
    const name = req.query.name;
    const link = req.query.link;
    const password = req.query.password;
    const Forbidden = ['create', 'remove', 'list'];

    if (!(name && link && password)) return res.status(400).send("Bad request");
    if (Forbidden.includes(name.toLowerCase())) return res.status(400).send("Forbidden name");
    if (password !== process.env.PASSWORD) return res.status(401).send("Wrong password");

    try {
        if (await DB.findOne({ name })) return res.status(400).send("Name already exists");
        
        await DB.create({ name, link })

    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
    res.status(201).send(`Visit your link at: ${ADDRESS}${name}`);
});

module.exports = router;