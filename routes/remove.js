const express = require('express');
const router = express.Router();

const DB = require('../models/shortlink');

router.get("/", async (req, res) => {
    const name = req.query.name;
    const password = req.query.password;

    if (!(name && password)) return res.status(400).send("Bad request");
    if (name.toLowerCase() === 'create' || name.toLowerCase() === 'remove') return res.status(400).send("Forbidden name");
    if (password !== process.env.PASSWORD) return res.status(400).send("Wrong password");

    try {
        if (!(await DB.findOne({ name }))) return res.status(400).send("Name does not exist");
        
        await DB.deleteOne({ name })

    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
    res.status(200).send("OK");
});

module.exports = router;