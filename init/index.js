const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

require("dotenv").config({ path: "../.env" });

//connect database 
async function main() {
    console.log("Mongo URL:", process.env.mongo_URL);
    await mongoose.connect(process.env.mongo_URL);
    console.log("Database Connected successfully.");
}

//intalize database. first delete all data then initalize new data.
const initDB = async () => {
    await Listing.deleteMany({});
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

start();//run start function