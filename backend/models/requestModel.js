const mongoose = require("mongoose");

const { Schema } = mongoose;

const requestSchema = new Schema({
  text: { type: String, maxLength: 300, required: true },
  status: { type: String, default: "Laukiama" },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: true,
  },
});

module.exports = mongoose.model("Request", requestSchema);
