const { model, Schema } = require("mongoose");

module.exports = model("shortlink", new Schema({
    name: String,
    link: String,
    date: { type: Date, default: Date.now }
}));