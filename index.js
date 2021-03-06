const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();
const PORT = process.env.PORT || 5000;
const DATABASE = process.env.DATABASE

const DB = require('./models/shortlink');

const app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/create', require('./routes/create'));
app.use('/remove', require('./routes/remove'));
app.use('/list', require('./routes/list'));

app.get('/:name', async (req, res) => {
    const name = req.params.name;
    const link = (await DB.findOne({ name }))?.link;
    if (!link) return res.status(404).send("Not found");
    const useDeathLine = (await DB.findOne({ name }))?.useDeathLine || false;
    if (useDeathLine) {
        const deathLine = (await DB.findOne({ name }))?.deathLine;
        if (deathLine < new Date()) {
            await DB.deleteOne({ name });
            return res.status(410).send("Link expired");
        }
    }
    await DB.updateOne({ name }, { $inc: { visited: 1 } });
    res.redirect(link);
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Database 💽");
}).catch((err) => {
    console.log(err)
});