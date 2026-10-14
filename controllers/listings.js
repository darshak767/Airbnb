const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const listsAll = await Listing.find({});

  res.render("listings/index.ejs", {
    listsAll,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const onelist = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!onelist) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  console.log(onelist);
  res.render("listings/show.ejs", {
    onelist,
  });
};

module.exports.createListing = async (req, res) => {
  let url = req.file ? req.file.path : "/img/albert.jpg";
  let filename = req.file ? req.file.filename : "listingimage";

  console.log(url, filename);

  const listingData = req.body.Listing;

  const { title, description, country, price, location } = listingData;

  const newList = new Listing({
    title,
    description,
    image: {
      url,
      filename,
    },
    country,
    price,
    location,
  });
  newList.owner = req.user._id;

  await newList.save();

  console.log("Listing created successfully and saved in database.");
  req.flash("success", "Listing created successfully!");

  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const onelist = await Listing.findById(id);

  if (!onelist) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", {
    onelist,
  });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const updatedData = req.body.Listing;

  const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!updatedListing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing updated successfully!");

  res.redirect("/listings");
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing deleted successfully!");

  res.redirect("/listings");
};
