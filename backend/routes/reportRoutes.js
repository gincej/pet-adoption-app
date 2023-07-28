const express = require("express");
const {
  sendReport,
  getAllReports,
} = require("../controllers/reportController");

const requireAuth = require("../middleware/requireAuth");
const checkAdmin = require("../middleware/checkAdmin");

const router = express.Router();

router.use(requireAuth);

router.post("/", sendReport);

router.use(checkAdmin);

router.get("/", getAllReports);
module.exports = router;
