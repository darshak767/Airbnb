const mongoose = require("mongoose");
const path = require("path");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

//connect database
async function main() {
  await mongoose.connect(process.env.mongo_URL);
  console.log("Database Connected successfully.");
}

const User = require("../models/user.js");

//intalize database. first delete all data then initalize new data.
const initDB = async () => {
  await Listing.deleteMany({});

  let defaultUser = await User.findById("6ac8e4071a90e336d437d929");
  if (!defaultUser) {
    defaultUser = await User.findOne({});
  }
  const ownerId = defaultUser ? defaultUser._id : "6ac8e4071a90e336d437d929";

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: ownerId,
  }));

  await Listing.insertMany(initData.data);
  console.log("Data was initialized.");
};

//maintain all things connect server, initalize data, and close mongoose connection
async function start() {
  try {
    await main();
    await initDB();
    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}

start(); //run start function
