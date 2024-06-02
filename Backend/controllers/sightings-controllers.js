// const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const Sighting = require("../models/sightings");
const Location = require("../models/locations");

// only used when a sighting is edited
async function getSightingById(req, res, next) {
  const sightingId = req.params.sid;
  let sighting;
  try {
    sighting = await Sighting.findById(sightingId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a sighting.",
      500
    );

    return next(error);
  }

  if (!sighting) {
    const error = new HttpError(
      "Could not find a sighting for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ sighting: sighting.toObject({ getters: true }) });
}

// This will only be used by the My Stats page
async function getSightingsByUserId(req, res, next) {
  const userId = req.params.uid;

  let sightings;
  try {
    sightings = await Sighting.find({ creator: userId }).populate("location");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find sightings.",
      500
    );

    return next(error);
  }

  res.json({
    sightings: sightings.map((sighting) =>
      sighting.toObject({ getters: true })
    ),
  });
}

async function createSighting(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { locationId, species, date, note } = req.body;

  const createdSighting = new Sighting({
    creator: req.userData.userId,
    location: locationId,
    species,
    date,
    note,
  });

  let location;
  try {
    location = await Location.findById(locationId); // will this work? Is the location's id in the right format?
  } catch (err) {
    const error = new HttpError(
      "Creating sighting failed, please try again.",
      500
    );
    return next(error);
  }

  if (!location) {
    const error = new HttpError(
      "Cound not find location for provided id.",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdSighting.save({ session: sess }); // failing here
    location.sightings.push(createdSighting);
    await location.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating sighting failed, please try again.",
      500
    );

    return next(error);
  }

  res
    .status(201)
    .json({ sighting: createdSighting.toObject({ getters: true }) });
}

async function updateSighting(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { species, date, note } = req.body;
  const sightingId = req.params.sid;

  let sighting;
  try {
    sighting = await Sighting.findById(sightingId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update sighting.",
      500
    );
    return next(error);
  }

  if (sighting.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this sighting.",
      401
    );
    return next(error);
  }

  sighting.species = species;
  sighting.date = date;
  sighting.note = note;

  try {
    await sighting.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update sighting.",
      500
    );
    return next(error);
  }
  // normally we would send the newly created sighting to the frontend, but I'm sending the location so we can render it with all it's sightings
  res.status(201).json({ sighting: sighting.toObject({ getters: true }) });
}

async function deleteSighting(req, res, next) {
  const sightingId = req.params.sid;

  let sighting;
  try {
    sighting = await Sighting.findById(sightingId).populate("location");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete sighting.",
      500
    );
    return next(error);
  }

  if (!sighting) {
    const error = new HttpError("Could not find sighting for this id.", 404);
    return next(error);
  }

  if (sighting.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this sighting.", //
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await sighting.deleteOne({ session: sess });
    sighting.location.sightings.pull(sighting); // THIS IS WHERE WE DELETE FROM LOCATION
    await sighting.location.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete sighting.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted sightin." });
}

exports.getSightingById = getSightingById;
exports.getSightingsByUserId = getSightingsByUserId;
exports.createSighting = createSighting;
exports.updateSighting = updateSighting;
exports.deleteSighting = deleteSighting;
