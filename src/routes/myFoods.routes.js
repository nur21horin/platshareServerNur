const { Router } = require("express");
const verifyToken = require("../middleware/verifyToken");
const { getMyFoods } = require("../controllers/foods.controller");

const router = Router();

router.get("/:email", verifyToken, getMyFoods);

module.exports = router;

