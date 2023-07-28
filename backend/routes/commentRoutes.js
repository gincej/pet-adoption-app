const express = require("express");

const {
  getAllComments,
  postComment,
  deleteComment,
} = require("../controllers/commentController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/:petId", getAllComments);
router.post("/", postComment);
router.delete("/:id", deleteComment);

module.exports = router;
