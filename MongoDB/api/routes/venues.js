const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Venue = require("../models/venue");

// });

router.get("/", (req, res) => {
  Venue.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
