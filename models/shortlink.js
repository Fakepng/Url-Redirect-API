const { model, Schema } = require("mongoose");

module.exports = model("shortlink", new Schema({
    name: String,
    link: String,
    visited: Number,
    date: { type: Date, default: Date.now }
}));