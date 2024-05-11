const express = require("express");
const { check } = require("express-validator");

const locationsControllers = require("../controllers/locations-controllers");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.get("/", locationsControllers.getAllLocations);

router.get("/:lid", locationsControllers.getLocationById);

router.get("/user/:uid", locationsControllers.getLocationsByUserId);

router.use(checkAuth);

router.post(
  "/",
  [
    // currently posting "Prospect Park" is failing these validation checks
    check("title").notEmpty(),
    check("coordinates").isObject(), // is an object, is not empty
    check("sightings").isArray(), // is an array, is not empty
  ],
  locationsControllers.createLocation
);

router.patch(
  "/:pid",
  [
    check("title").notEmpty(),
    // check("sightings").isArray()
  ],
  locationsControllers.updateLocation
);

router.delete("/:pid", locationsControllers.deleteLocation);

module.exports = router;
