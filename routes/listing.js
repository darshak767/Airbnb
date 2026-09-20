const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

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
  validateListing,
  wrapAsync(async (req, res) => {
    const listingData = req.body.Listing;

    const {
      title,
      description,
      image,
      country,
      price,
      location,
    } = listingData;

    const newList = new Listing({
      title,
      description,
      image: {
          url: image && image.trim() !== ""
          ? image
          : "/img/albert.jpg",
      },
      country,
      price,
      location,
    });

    await newList.save();

    console.log("Listing created successfully and saved in database.");
    req.flash("success", "Listing created successfully!");

    res.redirect("/listings");
  }),
);

// ===============================
// INDEX
// GET /listings
// ===============================
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listsAll = await Listing.find({});

    res.render("listings/index.ejs", {
      listsAll,
    });
  }),
);

// ===============================
// NEW LISTING FORM
// GET /listings/new
// ===============================
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// ===============================
// SHOW LISTING
// GET /listings/:id
// ===============================
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const onelist = await Listing.findById(id).populate("reviews");

    if (!onelist) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {
      onelist,
    });
  }),
);

// ===============================
// EDIT FORM
// GET /listings/:id/edit
// ===============================
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const onelist = await Listing.findById(id);

    if (!onelist) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", {
      onelist,
    });
  }),
);

// ===============================
// UPDATE LISTING
// PUT /listings/:id
// ===============================
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const updatedData = req.body.Listing;

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedListing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    req.flash("success", "Listing updated successfully!");

    res.redirect("/listings");
  }),
);

// ===============================
// DELETE LISTING
// DELETE /listings/:id
// ===============================
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully!");

    res.redirect("/listings");
  }),
);

module.exports = router;