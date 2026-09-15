const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

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
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }], //array of reviewSchema
});

listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

//create model(tabel) and give schema(header row)
const Listing = mongoose.model("Listing", listingSchema); //listing is table name

module.exports = Listing;
