const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
require("dotenv").config();
const path = require("path");

//MiddleWares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

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

app.post("/listing", async (req, res) => {
  let { title, description, img, country, price, phone, location } = req.body;

  let newlist = await new Listing({
    title: title,
    image: {url: img},
    description: description,
    country: country,
    price: price,
    phone: phone,
    location: location
  });

  await newlist
    .save()
    .then(() => {
      console.log("listing created suceesfully and save in database");
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("post is working");

  res.redirect("/listing");
});

//starting point and display all listings on this route
app.get("/listing", async (req, res) => {
  let listsAll = await Listing.find({});
  res.render("./listings/index.ejs", { listsAll });
});

app.get("/listing/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show id wise listing using this route
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;

  let onelist = await Listing.findById(id);
  res.render("listings/show.ejs", { onelist });
});

//server running on port 8000
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
