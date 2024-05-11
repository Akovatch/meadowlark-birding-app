const express = require("express");
const { check } = require("express-validator");

const sightingsControllers = require("../controllers/sightings-controllers");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

const options = require("../data");

// simple console.log of req obj
router.use((req, res, next) => {
  console.log(req.body);
  next();
});

router.get("/:sid", sightingsControllers.getSightingById);

router.get("/user/:uid", sightingsControllers.getSightingsByUserId);

router.use(checkAuth);

router.post(
  "/",
  [
    // creator should added to the object in controllers using userId added by check-auth.js
    check("locationId").notEmpty(), // is locationId sent from React?
    check("species")
      .notEmpty()
      .custom((value) => {
        if (!options.includes(value)) {
          return Promise.reject("Input is not a valid bird species."); // or throw an error
        }
        return true;
      }),
    check("date").notEmpty(),
    check("note").optional().isLength({ max: 40 }),
  ],
  sightingsControllers.createSighting
);

router.patch(
  "/:sid",
  [check("species").notEmpty(), check("date").notEmpty()],
  sightingsControllers.updateSighting
);

router.delete("/:sid", sightingsControllers.deleteSighting);

module.exports = router;
