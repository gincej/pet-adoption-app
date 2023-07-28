const Comment = require("../models/commentModel");
const Pet = require("../models/petModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
require("dotenv").config();

const getAllComments = async (req, res) => {
  const { petId } = req.params;
  const id = new mongoose.Types.ObjectId(petId);

  const allComments = await Comment.find({
    pet: id,
  })
    .sort({ createdAt: -1 })
    .populate("author", "username email isOrganisation organisationTitle");

  if (allComments.length === 0) {
    return res.status(404).json({ error: "Nėra komentarų." });
  }

  res.status(200).json(allComments);
};

const postComment = async (req, res) => {
  const { pet, author, body } = req.body;

  const petExists = await Pet.findById(pet);
  const userExists = await User.findById(author);

  if (!petExists) {
    return res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
  }

  if (!userExists) {
    return res.status(404).json({ error: "Toks vartotojas neegzistuoja." });
  }

  if (!new mongoose.Types.ObjectId(author).equals(req.user._id)) {
    return res.status(401).json({ error: "Neturite teisės rašyti komentaro." });
  }

  if (!body || body.length < 5) {
    return res
      .status(400)
      .json({
        error: "Komentaras negali būti tuščias ir trumpesnis nei 5 simboliai.",
      });
  }

  try {
    const newComment = await Comment.create({ pet, body, author });
    await newComment.populate("author");
    res.status(200).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;
  const comment = await Comment.findById(id);

  if (!comment) {
    return res.status(404).json({ error: "Toks komentaras neegzistuoja." });
  }

  if (!comment.author.equals(user) && req.user.role != process.env.ADMIN) {
    return res
      .status(401)
      .json({ error: "Neturite teisės ištrinti komentaro." });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Toks komentaras neegzistuoja." });
  }

  const commentToDelete = await Comment.findOneAndDelete({ _id: id });

  res.status(200).json(commentToDelete);
};

module.exports = {
  getAllComments,
  postComment,
  deleteComment,
};
