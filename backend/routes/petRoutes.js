const express = require("express");
const multer = require("multer");

const {
  getAllPets,
  getSinglePet,
  createPet,
  deletePet,
  editPet,
  getUserPets,
  likePet,
} = require("../controllers/petController");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../frontend/public/Pets/");
  },
  filename: (req, file, callback) => {
    const fileName =
      new Date().toISOString().replace(/:/g, "-") + file.originalname;
    callback(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getAllPets);
router.get("/:id", getSinglePet);
router.post("/", upload.array("petImages"), createPet);
router.delete("/:id", deletePet);
router.patch("/:id", upload.array("petImages"), editPet);
router.get("/user/:id", getUserPets);
router.patch("/:id/like", likePet);

module.exports = router;
