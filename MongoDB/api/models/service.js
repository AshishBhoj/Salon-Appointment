const { head } = require("lodash");
const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
  staff: [Number],
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
});

const getLastDocument = (Document) =>
  Document.find({}).limit(1).sort({ _id: -1 }).exec();
serviceSchema.pre("save", async function preSave(next) {
  let lastDoc = await getLastDocument(this.constructor);
  lastDoc = lastDoc ? head(lastDoc) : null;
  this._id = lastDoc ? Number(lastDoc._id) + 1 : 1;
  this.id = lastDoc ? Number(lastDoc.id) + 1 : 1;
  return next();
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
