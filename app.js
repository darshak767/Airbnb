const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");

const ExpressError = require("./utils/ExpressError.js");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");

const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true, // Cookie cannot be accessed via client-side JavaScript
  }
};

// ===============================
// DATABASE
// ===============================
async function main() {
  await mongoose.connect(process.env.mongo_URL);
  console.log("Database connected successfully.");
}

main()
  .then(() => {
    console.log("Connection built successfully.");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

// ===============================
// ROUTES
// ===============================
app.get("/", (req, res) => {
  res.send("Hello World this is my project.");
});

app.use(session(sessionOptions));
app.use(flash()); 

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

app.get("/privacy", (req, res) => {
  res.send("Privacy policy");
});

app.get("/terms", (req, res) => {
  res.send("Terms and conditions");
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Ignore missing source map requests from devtools
app.get(/\.map$/, (req, res) => {
  res.status(404).end();
});

// ===============================
// 404 ERROR
// ===============================
app.use((req, res, next) => {
  next(new ExpressError(404, `Page not found: ${req.method} ${req.originalUrl}`));
});

// ===============================
// ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.log(err);

  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(err);
  } else {
    console.warn(`[${statusCode}] ${req.method} ${req.originalUrl} - ${err.message}`);
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).render("error.ejs", {
    err,
  });
});

// ===============================
// SERVER
// ===============================
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});