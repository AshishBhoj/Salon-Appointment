const mongoose = require("mongoose");
const { head } = require("lodash");

const daySchedule = {
  workTime: {
    from: String,
    to: String,
  },
};

const venueSchema = mongoose.Schema({
  _id: { type: Number },
  name: { type: String, required: true },
  schedule: {
    monday: daySchedule.workTime,
    tuesday: daySchedule.workTime,
    wednesday: daySchedule.workTime,
    thursday: daySchedule.workTime,
    friday: daySchedule.workTime,
    saturday: daySchedule.workTime,
    sunday: daySchedule.workTime,
  },
});
const getLastDocument = (Document) =>
  Document.find({}).limit(1).sort({ _id: -1 }).exec();
venueSchema.pre("save", async function preSave(next) {
  let lastDoc = await getLastDocument(this.constructor);
  lastDoc = lastDoc ? head(lastDoc) : null;
  this._id = lastDoc ? Number(lastDoc._id) + 1 : 1;
  this.id = lastDoc ? Number(lastDoc.id) + 1 : 1;
  return next();
});

const Venue = mongoose.model("Venue", venueSchema);

(module.exports = Venue), daySchedule;
