const { Router } = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
  createRequest,
  deleteRequest,
  getRequestsByEmail,
  updateRequestStatus,
} = require("../controllers/requests.controller");

const router = Router();

router.post("/", verifyToken, createRequest);
router.get("/:email", verifyToken, getRequestsByEmail);
router.delete("/:id", verifyToken, deleteRequest);
router.patch("/:id", verifyToken, updateRequestStatus);

module.exports = router;

