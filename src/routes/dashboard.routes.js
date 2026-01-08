const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  getDashboardStats,
  getDashboardUsers,
  getDashboardFoods,
} = require("../controllers/dashboard.controller");

router.get("/stats", verifyToken, getDashboardStats);
router.get("/users", verifyToken, getDashboardUsers);
router.get("/foods", verifyToken, getDashboardFoods);

module.exports = router;
