const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Sighting = require("../models/sightings");
const Location = require("../models/locations");
const User = require("../models/user");

async function getAllLocations(req, res, next) {
  let locations;
  try {
    locations = await Location.find({}).populate("sightings"); // This is where we need to populate the sightins of location
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not retrieve locations.",
      500
    );

    return next(error);
  }

  if (!locations || locations.length === 0) {
    const error = new HttpError(
      "Could not find a location for the provided id.",
      404
    );
    return next(error);
  }

  res.json({
    locations: locations.map((location) =>
      location.toObject({ getters: true })
    ),
  });
}

async function getLocationById(req, res, next) {
  const locationId = req.params.lid;
  let location;
  try {
    location = await Location.findById(locationId)
      .populate("sightings")
      .populate("creator"); // This is where we need to populate the sightins of location
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a location.",
      500
    );

    return next(error);
  }

  if (!location) {
    const error = new HttpError(
      "Could not find a location for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ location: location.toObject({ getters: true }) });
}

async function getLocationsByUserId(req, res, next) {
  const userId = req.params.uid;

  let locations;
  try {
    locations = await Location.find({ creator: userId }).populate("sightings");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find locations.",
      500
    );

    return next(error);
  }

  res.json({
    locations: locations.map((location) =>
      location.toObject({ getters: true })
    ),
  });
}

async function createLocation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { title, coordinates, sightings } = req.body;

  const createdLocation = new Location({
    title,
    coordinates,
    creator: req.userData.userId,
    sightings,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating location failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Cound not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdLocation.save({ session: sess });
    user.locations.push(createdLocation); // THIS IS WHERE WE ADDED LOCATION TO USER
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating location failed, please try again.",
      500
    );

    return next(error);
  }

  res
    .status(201)
    .json({ location: createdLocation.toObject({ getters: true }) });
}

async function updateLocation(req, res, next) {
  const errors = validationResult(req); // the chains must be revised
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { title } = req.body;
  const locationId = req.params.pid;

  let location;
  try {
    location = await Location.findById(locationId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update location.",
      500
    );
    return next(error);
  }

  if (location.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this location.",
      401
    );
    return next(error);
  }

  location.title = title;
  // location.sightings = sightings;

  try {
    await location.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update location.",
      500
    );
    return next(error);
  }
  // The object returned here is never actually used on the front end
  res.status(200).json({ location: location.toObject({ getters: true }) });
}

async function deleteLocation(req, res, next) {
  const locationId = req.params.pid;

  let location;
  try {
    location = await Location.findById(locationId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete location.",
      500
    );
    return next(error);
  }

  if (!location) {
    const error = new HttpError("Could not find location for this id.", 404);
    return next(error);
  }

  if (location.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this location.",
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await location.deleteOne({ session: sess });
    location.creator.locations.pull(location); 
    await location.creator.save({ session: sess });
    await Sighting.deleteMany({ location: locationId }); // THIS LINE GIVES US "ON DELETE CASCADE" FUNCTIONALITY
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete location.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted location." });
}

exports.getAllLocations = getAllLocations;
exports.getLocationById = getLocationById;
exports.getLocationsByUserId = getLocationsByUserId;
exports.createLocation = createLocation;
exports.updateLocation = updateLocation;
exports.deleteLocation = deleteLocation;
