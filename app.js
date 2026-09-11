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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//create Main Functions for database connection
async function main() {
  console.log("main() START - connecting to database");

  await mongoose.connect(process.env.mongo_URL);

  console.log("Database Connected successfully.");
  console.log("main() END");
}

//calling main function
main()
  .then(() => {
    console.log("Connection build sucessfully");
  })
  .catch((err) => {
    console.log("Error Occured", err);
  });

app.use((req, res, next) => {
  console.log(`REQUEST START: ${req.method} ${req.originalUrl}`);
  next();
  console.log(`REQUEST MIDDLEWARE END: ${req.method} ${req.originalUrl}`);
});

//root working
app.get("/", (req, res) => {
  console.log("GET / START");

  res.send("Hello World this is my project.");

  console.log("GET / END");
});

const validateListing = (req, res, next) => {
  console.log("validateListing START");

  let { err } = listingSchema.validate(req.body);

  if (err) {
    console.log("validateListing found an error");
    throw new ExpressError(400, err);
  } else {
    console.log("validateListing passed");
    next();
  }

  console.log("validateListing END");
};

//create Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    console.log("POST /listings START");

    let { title, description, img, country, price, location } = req.body;

    let newlist = await new Listing({
      title: title,
      image: { url: img && img.length > 0 ? img : "/img/albert.jpg" },
      description: description,
      country: country,
      price: price,
      location: location,
    });

    console.log("New listing object created");

    await newlist.save();

    console.log("Listing saved in database");
    console.log("listing created suceesfully and save in database");

    res.redirect("/listings");

    console.log("POST /listings END");
  }),
);

//starting point and display all listings on this route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    console.log("GET /listings START");

    console.log("Searching listings in MongoDB...");
    let listsAll = await Listing.find({});

    console.log("MongoDB query completed");
    console.log(`Listings found: ${listsAll.length}`);

    console.log("Rendering index.ejs...");
    res.render("./listings/index.ejs", { listsAll });

    console.log("GET /listings END");
  }),
);

app.get("/listings/new", (req, res) => {
  console.log("GET /listings/new START");

  console.log("Rendering new.ejs...");
  res.render("listings/new.ejs");

  console.log("GET /listings/new END");
});

//show id wise listing using this route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    console.log("GET /listings/:id START");

    console.log("Searching listing by ID in MongoDB...");
    let onelist = await Listing.findById(id);
    console.log("MongoDB query completed");

    console.log("Rendering show.ejs...");
    res.render("listings/show.ejs", { onelist });

    console.log("GET /listings/:id END");
  }),
);

//render edit.ejs file
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    console.log("GET /listings/:id/edit START");

    let { id } = req.params;
    console.log("Listing ID received:", id);

    let onelist = await Listing.findById(id);
    console.log("Listing fetched from database");

    res.render("listings/edit.ejs", { onelist });
    console.log("GET /listings/:id/edit END");
  }),
);

//update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    console.log("PUT /listings/:id START");

    let { id } = req.params;
    console.log("Listing ID received:", id);

    let updatedData = req.body.Listing;
    console.log("Updated data received");

    await Listing.findByIdAndUpdate(id, updatedData, {
      runValidators: true,
    });

    console.log("Listing updated in database");

    res.redirect("/listings");
    console.log("PUT /listings/:id END");
  }),
);

//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    console.log("DELETE /listings/:id START");

    let { id } = req.params;
    console.log("Listing ID received:", id);

    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log("Listing deleted from database");

    res.redirect("/listings");
    console.log("DELETE /listings/:id END");
  }),
);

app.use((req, res, next) => {
  console.log("404 MIDDLEWARE START");

  next(new ExpressError(404, "Page not found"));

  console.log("404 MIDDLEWARE END");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log("ERROR MIDDLEWARE START");

  console.log(err);

  const statusCode = err.statusCode || 500;
  console.log("Status code:", statusCode);

  console.log("Rendering error.ejs...");

  res.status(statusCode).render("error.ejs", { err });

  console.log("ERROR MIDDLEWARE END");
});

//server running on port 8000
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
