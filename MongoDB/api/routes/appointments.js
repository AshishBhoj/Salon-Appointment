const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Appointment = require("../models/appointment");

router.get("/", async (req, res) => {
  await Appointment.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", getAppointment, (req, res) => {
  let id = req.params.id;
  Appointment.findById({ _id: id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/", validation, checkAppointment, async (req, res) => {
  let appointment = new Appointment({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    product: req.body.product,
    staff: req.body.staff,
    price: req.body.price,
    duration: req.body.duration,
    date: req.body.date,
    from: req.body.from,
    to: req.body.to,
  });
  try {
    const newAppointment = await appointment.save();
    res.status(200).json({ message: "Appointment Registered" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// router.post("/", validation, checkAppointment, async (req, res) => {
//   let appointment = new Appointment({
//     name: req.body.name,
//     phoneNumber: req.body.phoneNumber,
//     product: req.body.product,
//     staff: req.body.staff,
//     price: req.body.price,
//     duration: req.body.duration,
//     date: req.body.date,
//     from: req.body.from,
//     to: req.body.to,
//   });
//   try {
//     const newAppointment = await appointment.save();
//     res.status(200).json({ message: "Appointment Registered" });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

router.patch(
  "/:id",
  validation,
  checkAppointment,
  getAppointment,
  async (req, res) => {
    if (req.body.name != null) {
      res.appointment.name = req.body.name;
    }
    if (req.body.phoneNumber != null) {
      res.appointment.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.product != null) {
      res.appointment.product = req.body.product;
    }
    if (req.body.staff != null) {
      res.appointment.staff = req.body.staff;
    }
    if (req.body.price != null) {
      res.appointment.price = req.body.price;
    }
    if (req.body.duration != null) {
      res.appointment.duration = req.body.duration;
    }
    if (req.body.date != null) {
      res.appointment.date = req.body.date;
    }
    if (req.body.from != null) {
      res.appointment.from = req.body.from;
    }
    if (req.body.to != null) {
      res.appointment.to = req.body.to;
    }
    try {
      const updateAppointment = await res.appointment.save();
      res.status(200).json({ updateAppointment });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.delete("/:id", getAppointment, async (req, res) => {
  try {
    await res.appointment.remove();
    res
      .status(200)
      .json({ message: "Your appointment is cancelled successfully !!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getAppointment(req, res, next) {
  let appointment;
  try {
    appointment = await Appointment.findById(req.params.id);
    if (appointment == null) {
      return res.status(404).json({ message: "Appointment not found !!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.appointment = appointment;
  next();
}

async function checkAppointment(req, res, next) {
  let appointment = new Appointment({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    product: req.body.product,
    staff: req.body.staff,
    price: req.body.price,
    duration: req.body.duration,
    date: req.body.date,
    from: req.body.from,
    to: req.body.to,
  });
  try {
    appointment = await Appointment.find({
      staff: req.body.staff,
    })
      .where({
        date: req.body.date,
      })
      .where({
        from: req.body.from,
      })
      .countDocuments("count")
      .exec()
      .then((count) => {
        if (count && count > 0) {
          // console.log("Appointment not available");
          return (
            res
              .status(409)
              // .json({ message: "Appointment not available, Check other slots" });
              .json({
                message:
                  "Appointment registration failed !! , Slot not availabe",
                "Valid Slot Range":
                  "{(from value - to value) --------> (10-11),(11-12),(12-13),(13-14),(14-15),(15-16),(16-17),(17-18),(18-19),(19-20),(20-21)}",
              })
          );
        } else {
          return next();
        }
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function validation(req, res, next) {
  let validateAppointment;
  try {
    validateAppointment = new Appointment({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      product: req.body.product,
      duration: req.body.duration,
      staff: req.body.staff,
      from: req.body.from,
      to: req.body.to,
    });
    if (req.body.name.length < 3) {
      return res
        .status(400)
        .json({ message: "Name should have alteast 3 character" });
    }
    if (req.body.phoneNumber.length !== 10) {
      return res.status(400).json({ message: "Enter a valid contact number" });
    }
    if (req.body.from < 10 || req.body.from > 20) {
      return res.status(400).json({ message: "Salooon is closed" });
    }
    if (req.body.to < 11 || req.body.to > 21) {
      return res.status(400).json({ message: "Saloon is closed" });
    }
    if (req.body.date > 31) {
      return res.status(400).json({ message: "Invalid Date" });
    }

    if (req.body.to - req.body.from !== 1) {
      return res.status(400).json({ message: "Invalid Time Slot" });
    }
    let staffArr = ["1", "2", "3"];
    if (!staffArr.includes(req.body.staff)) {
      return res.status(400).json({ message: "Staff not available" });
    }
    if (req.body.duration < 1 || req.body.duration > 1) {
      return res.status(400).json({ message: "Invalid Time Duration" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.validateAppointment = validateAppointment;
  next();
}

module.exports = router;
