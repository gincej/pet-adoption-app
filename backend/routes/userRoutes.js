const express = require("express");
const multer = require("multer");
const requireAuth = require("../middleware/requireAuth");
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();

const {
  loginUser,
  signupUser,
  editUser,
  getSingleUser,
  deleteUser,
  getAllUsers,
  sendAlert,
  removeAlert,
} = require("../controllers/userController");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../frontend/public/Users/");
  },
  filename: (req, file, callback) => {
    const fileName =
      new Date().toISOString().replace(/:/g, "-") + file.originalname;
    callback(null, fileName);
  },
});

const upload = multer({ storage });

router.post("/login", loginUser);

router.post("/signup", signupUser);

router.use(requireAuth);

router.patch("/:id", upload.single("userImage"), editUser);

router.get("/:id", getSingleUser);

router.patch("/removealert/:id", removeAlert);

router.use(checkAdmin);

router.delete("/:id", deleteUser);

router.get("/", getAllUsers);

router.patch("/alert/:id", sendAlert);

module.exports = router;
