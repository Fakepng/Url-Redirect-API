const { model, Schema } = require("mongoose");

module.exports = model("shortlink", new Schema({
    name: String,
    link: String,
    visited: Number,
    useDeathLine: Boolean,
    deathLine: Date,
    date: { type: Date, default: Date.now }
}));