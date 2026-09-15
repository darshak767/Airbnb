const express = require("express");
const router = express.Router();

//Post routes
router.get("/", (req, res) => {
  res.send("GET for Posts");
});

router.get("/:id", (req, res) => {
  let { id } = req.params;
  res.send(`GET for Post with ID: ${id}`);
});

router.post("/", (req, res) => {
  res.send("POST for Posts");
});

router.delete("/:id", (req, res) => {
  let { id } = req.params;
  res.send(`DELETE for Post with ID: ${id}`);
});

module.exports = router;