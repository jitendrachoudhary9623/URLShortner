const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//Schema for mongo
const urlSchema = new Schema({
  actualUrl: String,
  shortUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const ModelClass = mongoose.model("shortUrl", urlSchema);

module.exports = ModelClass;
