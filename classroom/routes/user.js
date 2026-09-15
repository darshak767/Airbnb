const express = require("express");
const router = express.Router();

//user routes
router.get("/", (req, res) => {
  res.send("GET for Users");
});

router.get("/:id", (req, res) => {
  let { id } = req.params;
  res.send(`GET for User with ID: ${id}`);
});

router.post("/", (req, res) => {
  res.send("POST for Users");
});

router.delete("/:id", (req, res) => {
  let { id } = req.params;
  res.send(`DELETE for User with ID: ${id}`);
});

module.exports = router;