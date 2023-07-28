const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema({
  animal: {
    type: String,
    required: true,
  },
  breeds: {
    type: Array,
    required: true,
  },
  traits: {
    type: Array,
    required: true,
  },
  lengths: {
    type: Array,
    required: true,
  },
  colors: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
