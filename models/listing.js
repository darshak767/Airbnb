const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
      default:
        "https://wallpapers.com/images/thumbnail/relaxing-old-lion-sya5mbipxyiouzzw.jpg",
    },
  },
  price: Number,
  location: String,
  country: String,
});

//create model(tabel) and give schema(header row) 
const listing = mongoose.model("Listing", listingSchema); //listing is table name

module.exports = listing;
