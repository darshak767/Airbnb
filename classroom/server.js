const express = require("express");
const app = express();
const usersRoutes = require("./routes/user.js");
const postRoutes = require("./routes/post.js");
const session = require("express-session");
const flash = require('connect-flash');
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionoptions = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionoptions));
app.use(flash());

app.get("/register", (req, res) => {
  let {name } = req.query;
  req.session.name = name;
  req.flash("success", "You have registered successfully!");
  console.log(req.session.name);
  res.send(`Hello ${name}, you are registered successfully!`);
});

app.get("/test", (req, res) => {
  res.locals.success = req.flash("success");
  res.render("page.ejs", { name: req.session.name });
});

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});