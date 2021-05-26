const { head } = require("mongoose");
const mongoose = require("mongoose");

const daySchedule = {
  workTime: {
    from: String,
    to: String,
  },
};

const staffSchema = mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  venue: { type: Number, required: true },
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
staffSchema.pre("save", async function preSave(next) {
  let lastDoc = await getLastDocument(this.constructor);
  lastDoc = lastDoc ? head(lastDoc) : null;
  this._id = lastDoc ? Number(lastDoc._id) + 1 : 1;
  this.id = lastDoc ? Number(lastDoc.id) + 1 : 1;
  return next();
});

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
