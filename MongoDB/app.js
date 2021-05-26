const express = require("express");
const app = express();
const mongoose = require("mongoose");

const dbURI =
  "mongodb+srv://<username>:<password>@cluster0.eldh5.mongodb.net/<databaseName>?retryWrites=true&w=majority";

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const serviceRoutes = require("./api/routes/services");
const venueRoutes = require("./api/routes/venues");
const staffRoutes = require("./api/routes/staffs");
const AppointmentRoutes = require("./api/routes/appointments");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Controll-Allow-Origin", "*");
  res.header(
    "Access-Controll-Allow-Header', 'Origin, X-Requested-With, Content-type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/services", serviceRoutes);
app.use("/venues", venueRoutes);
app.use("/staffs", staffRoutes);
app.use("/appointments", AppointmentRoutes);

module.exports = app;
