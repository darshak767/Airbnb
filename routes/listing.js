const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

const { isLoggedIn, isowner } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

// Validation Middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body.Listing);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }

  next();
};

router.route("/")
  .get(
    wrapAsync(listingController.index)
  )
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  );


router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
  .get(
    wrapAsync(listingController.showListing)
  )
  .put(
    isLoggedIn,
    isowner,
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(
    isLoggedIn,
    wrapAsync(listingController.deleteListing),
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;