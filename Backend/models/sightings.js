const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sightingSchema = new Schema({
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  location: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Location",
  },
  species: { type: String, required: true },
  date: { type: String, required: true },
  note: { type: String, required: false },
});

module.exports = mongoose.model("Sighting", sightingSchema);
