const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
require("dotenv").config();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

//MiddleWares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//create Main Functions for database connection
async function main() {
  await mongoose.connect(process.env.mongo_URL);
  console.log("Database Connected successfully.");
}

//calling main function
main()
  .then(() => {
    console.log("Connection build sucessfully");
  })
  .catch((err) => {
    console.log("Error Occured", err);
  });

//root working
app.get("/", (req, res) => {
  res.send("Hello World this is my project.");
});

const validateListing = (req, res, next) => {
  let {err} = listingSchema.validate(req.body);

  if (err) {
    throw new ExpressError(400, err);
  }else{
    next();
  }
};

//create Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { title, description, img, country, price, location } = req.body;

    let newlist = await new Listing({
      title: title,
      image: { url: img && img.length > 0 ? img : "/img/albert.jpg" },
      description: description,
      country: country,
      price: price,
      location: location,
    });

    await newlist.save();
    console.log("listing created suceesfully and save in database");
    res.redirect("/listings");
  }),
);

//starting point and display all listings on this route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let listsAll = await Listing.find({});
    res.render("./listings/index.ejs", { listsAll });
  }),
);

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show id wise listing using this route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let onelist = await Listing.findById(id);
    res.render("listings/show.ejs", { onelist });
  }),
);

//render edit.ejs file
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let onelist = await Listing.findById(id);
    res.render("listings/edit.ejs", { onelist });
  }),
);

//update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedData = req.body.Listing;

    await Listing.findByIdAndUpdate(id, updatedData, {
      runValidators: true,
    });
    res.redirect("/listings");
  }),
);

//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);

  res.render("../error.ejs", { err });
});

//server running on port 8000
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
