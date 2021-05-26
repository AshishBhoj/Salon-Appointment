const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Staff = require("../models/staff");
router.get("/", (req, res) => {
  Staff.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
