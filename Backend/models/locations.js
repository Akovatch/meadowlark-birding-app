const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  title: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  sightings: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Sighting" },
  ],
});

module.exports = mongoose.model("Location", locationSchema);
