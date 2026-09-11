const mongoose = require("mongoose");

const Schema = mongoose.Schema;

console.log("listing.js loaded");

//create schema for the database using function

const listingSchema = new Schema({
  title: {
    type: String,

    required: true,
  },

  description: String,

  image: {
    filename: {
      type: String,

      default: "listingimage",
    },

    url: {
      type: String,

      default: "/img/albert.jpg",
    },
  },

  price: {
    type: Number,

    required: true,

    min: [0, "Price cannot be negative"],
  },

  location: {
    type: String,

    required: true,
  },

  country: {
    type: String,

    required: true,
  },
});

//create model(tabel) and give schema(header row)

console.log("Creating Listing model...");

const Listing = mongoose.model("Listing", listingSchema);

console.log("Listing model created");

module.exports = Listing;
