const mongoose = require("mongoose");
const Comment = require("./commentModel");
const Request = require("./requestModel");

const { Schema } = mongoose;

const petSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
    },
    category: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 500,
      required: true,
    },
    furLength: {
      type: String,
    },
    traits: {
      type: Array,
      required: true,
    },
    contacts: {
      type: String,
      maxLength: 200,
      required: true,
    },
    pictures: {
      type: Array,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
    },
    reserved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

petSchema.pre("findOneAndDelete", async function (next) {
  try {
    const petId = this.getQuery()["_id"];
    await Comment.deleteMany({ pet: petId });
    await Request.deleteMany({ pet: petId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Pet", petSchema);
