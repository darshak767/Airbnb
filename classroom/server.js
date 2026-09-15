const express = require("express");
const app = express();
const usersRoutes = require("./routes/user.js");
const postRoutes = require("./routes/post.js");

app.use("/cookies", (req, res) => {
  res.cookie("greeting", "hello");
  res.send("Cookies are working");
});

app.get("/", (req, res) => {
  res.send("root is working");
});

app.use("/users", usersRoutes);
app.use("/posts", postRoutes);

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});