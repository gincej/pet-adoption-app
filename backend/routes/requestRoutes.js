const express = require("express");
const {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  reservePet,
  removeRequest,
  cancelRequest,
} = require("../controllers/requestController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/", createRequest);
router.get("/", getSentRequests);
router.get("/myrequests", getReceivedRequests);
router.patch("/reserve/:id", reservePet);
router.patch("/cancel/:id", cancelRequest);
router.patch("/remove/:id", removeRequest);
module.exports = router;
