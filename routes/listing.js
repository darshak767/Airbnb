const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

const { isLoggedIn, isowner } = require("../middleware.js");

const { index, renderNewForm, showListing, creatListing,  renderEditForm, updateListing, deleteListing} = require("../controllers/listings.js");

// ===============================
// Validation Middleware
// ===============================
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body.Listing);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }

  next();
};

// ===============================
// CREATE LISTING
// POST /listings
// ===============================
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(creatListing)
);

// ===============================
// INDEX
// GET /listings
// ===============================
router.get(
  "/",
  wrapAsync(index)
);

// ===============================
// NEW LISTING FORM
// GET /listings/new
// ===============================
router.get("/new", isLoggedIn, renderNewForm);

// ===============================
// SHOW LISTING
// GET /listings/:id
// ===============================
router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(showListing)
);

// ===============================
// EDIT FORM
// GET /listings/:id/edit
// ===============================
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(renderEditForm)
);

// ===============================
// UPDATE LISTING
// PUT /listings/:id
// ===============================
router.put(
  "/:id",
  isLoggedIn,
  isowner,
  validateListing,
  wrapAsync(updateListing),
);

// ===============================
// DELETE LISTING
// DELETE /listings/:id
// ===============================
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(deleteListing),
);

module.exports = router;