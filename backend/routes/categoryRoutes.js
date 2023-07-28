const express = require("express");

const {
  getAllCategories,
  postCategory,
  deleteCategory,
  editCategory,
} = require("../controllers/categoryController");

const requireAuth = require("../middleware/requireAuth");
const checkAdmin = require("../middleware/checkAdmin");

const router = express.Router();

router.use(requireAuth);

router.get("/", getAllCategories);

router.use(checkAdmin);

router.post("/", postCategory);
router.delete("/:id", deleteCategory);
router.patch("/:id", editCategory);

module.exports = router;
