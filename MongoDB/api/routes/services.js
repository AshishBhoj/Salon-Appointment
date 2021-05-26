const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Service = require("../models/service");

router.get("/", (req, res) => {
  Service.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/:id", getService, async (req, res) => {
  let id = req.params.id;
  Service.findById({ _id: id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

async function getService(req, res, next) {
  let service;
  try {
    service = await Service.findById(req.params.id);
    if (service == null) {
      return res.status(404).json({ Message: "Service not found !!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.service = service;
  next();
}

module.exports = router;
