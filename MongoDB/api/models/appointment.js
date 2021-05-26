const { head } = require("lodash");
const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  product: { type: String, required: true },
  staff: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String, required: true },
  date: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
});

// const appointmentSchema = mongoose.Schema({
//   userName: { type: String, required: true },
//   userNumber: { type: Number },
//   service: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Service",
//     required: true,
//   },
//   date: {
//     type: String,
//     required: true,
//   },
//   timeSlot: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     required: true,
//     enum: ["pending", "accepted", "rejected"],
//     default: "pending",
//   },
// });

const getLastDocument = (Document) =>
  Document.find({}).limit(1).sort({ _id: -1 }).exec();
appointmentSchema.pre("save", async function preSave(next) {
  let lastDoc = await getLastDocument(this.constructor);
  lastDoc = lastDoc ? head(lastDoc) : null;
  this._id = lastDoc ? Number(lastDoc._id) + 1 : 1;
  this.id = lastDoc ? Number(lastDoc.id) + 1 : 1;
  return next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
