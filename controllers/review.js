const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createReview = async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    return next(new ExpressError(404, "Listing not found"));
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log("New Review:", newReview);

  await newReview.save();

  listing.reviews.push(newReview._id);

  await listing.save();

  console.log("Review added successfully.");
  req.flash("success", "Review added successfully!");

  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    {
      $pull: {
        reviews: reviewId,
      },
    },
    {
      returnDocument: "after",
    },
  );

  if (!listing) {
    return next(new ExpressError(404, "Listing not found"));
  }

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");

  res.redirect(`/listings/${id}`);
};
