const Review = require("../models/reviewModel");
const mongoose = require("mongoose");
require("dotenv").config();

const getAllReviews = async (req, res) => {
  const { userId } = req.params;
  const id = new mongoose.Types.ObjectId(userId);

  const allReviews = await Review.find({
    user: id,
  })
    .sort({ createdAt: -1 })
    .populate("author", "username isOrganisation organisationTitle");

  if (allReviews.length === 0) {
    return res.status(404).json({ error: "Nėra atsiliepimų." });
  }

  res.status(200).json(allReviews);
};

const postReview = async (req, res) => {
  const { user, author, body, rating } = req.body;

  if (!new mongoose.Types.ObjectId(author).equals(req.user._id)) {
    return res
      .status(401)
      .json({ error: "Neturite teisės rašyti atsiliepimo." });
  }

  const exists = await Review.findOne({ author, user });

  if (exists) {
    return res.status(500).json({
      error: "Atsiliepimą galima pateikti tik vieną kartą.",
    });
  }

  if (!body || body.length < 5) {
    return res
      .status(400)
      .json({
        error:
          "Atsiliepimas negali būti tuščias ar trumpesnis nei 5 simboliai.",
      });
  }

  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ error: "Įvertinimas turi būti tarp 1 ir 5." });
  }

  try {
    const newReview = await Review.create({ user, body, author, rating });
    await newReview.populate("author");
    res.status(200).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;
  const review = await Review.findById(id);

  if (!review) {
    return res.status(404).json({ error: "Toks atsiliepimas neegzistuoja." });
  }

  if (!review.author.equals(user) && req.user.role != process.env.ADMIN) {
    return res
      .status(401)
      .json({ error: "Neturite teisės ištrinti atsiliepimo." });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Toks atsiliepimas neegzistuoja." });
  }

  const reviewToDelete = await Review.findOneAndDelete({ _id: id });

  if (!reviewToDelete) {
    res.status(404).json({ error: "Toks atsiliepimas neegzistuoja." });
  }

  res.status(200).json(reviewToDelete);
};

module.exports = {
  getAllReviews,
  postReview,
  deleteReview,
};
