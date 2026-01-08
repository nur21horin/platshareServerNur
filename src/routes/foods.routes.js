const { Router } = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
  createFood,
  updateFood,
  deleteFood,
  getAvailableFoods,
  getFeaturedFoods,
  getFoodById,
} = require("../controllers/foods.controller");

const router = Router();

router.get("/", getAvailableFoods);
router.get("/featured", getFeaturedFoods);
router.get("/:id", getFoodById);

router.post("/", verifyToken, createFood);
router.put("/:id", verifyToken, updateFood);
router.delete("/:id", verifyToken, deleteFood);

module.exports = router;

