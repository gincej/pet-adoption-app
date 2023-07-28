const express = require("express");

const {
  getAllReviews,
  postReview,
  deleteReview,
} = require("../controllers/reviewController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/:userId", getAllReviews);
router.post("/", postReview);
router.delete("/:id", deleteReview);

module.exports = router;
