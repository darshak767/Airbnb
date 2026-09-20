const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");

// ===============================
// Validation Middleware
// ===============================
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }

  next();
};

// ===============================
// CREATE REVIEW
// POST /listings/:id/reviews
// ===============================
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }

    const newReview = new Review(req.body.review);

    await newReview.save();

    listing.reviews.push(newReview._id);

    await listing.save();

    console.log("Review added successfully.");
    req.flash("success", "Review added successfully!");

    res.redirect(`/listings/${listing._id}`);
  }),
);

// ===============================
// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
// ===============================
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      {
        $pull: {
          reviews: reviewId,
        },
      },
      {
        new: true,
      },
    );

    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }

    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
