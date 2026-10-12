const Listing = require('./models/listing')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(req.path, "..", req.originalUrl);

    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    } else if (req.params && req.params.id) {
      req.session.redirectUrl = `/listings/${req.params.id}`;
    } else {
      req.session.redirectUrl = "/listings";
    }

    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isowner = async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }

  next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect("/listings");
  }

  if (!review.author || !review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};