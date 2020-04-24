const express = require("express");
const router = express.Router();

router.get("/login", (request, response) => {
  response.render("login");
});

module.exports = router;
