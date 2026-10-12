const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");

const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

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
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview),
);

// ===============================
// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
// ===============================
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview),
);

module.exports = router;