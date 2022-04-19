const express = require('express');
const router = express.Router();

const DB = require('../models/shortlink');

router.get("/", async (req, res) => {
    const name = req.query.name;
    const link = req.query.link;
    const password = req.query.password;

    if (!(name && link && password)) return res.status(400).send("Bad request");
    if (name.toLowerCase() === 'create' || name.toLowerCase() === 'remove') return res.status(400).send("Forbidden name");
    if (password !== process.env.PASSWORD) return res.status(400).send("Wrong password");

    try {
        if (await DB.findOne({ name })) return res.status(400).send("Name already exists");
        
        await DB.create({ name, link })

    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
    res.status(200).send("Visit your link: https://short.fakepng.com/" + link);
});

module.exports = router;