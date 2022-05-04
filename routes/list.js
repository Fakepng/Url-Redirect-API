const express = require('express');
const router = express.Router();

const DB = require('../models/shortlink');

router.get("/", async (req, res) => {
    const password = req.query.password;

    if (password !== process.env.PASSWORD) return res.status(401).send("Wrong password");

    try {
        const links = await DB.find();
        return res.status(200).send(links);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
});

module.exports = router;