const { Router } = require("express");
const verifyToken = require("../middleware/verifyToken");
const { getCollections } = require("../db/mongoClient");

const router = Router();

router.put("/users/:uid", verifyToken, async (req, res) => {
  const { uid } = req.params;
  const { bio } = req.body;
  const { users } = await getCollections();

  try {
    await users.updateOne({ uid }, { $set: { bio } }, { upsert: true });
    res.send({ message: "Profile updated successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to update profile", error: error.message });
  }
});
router.get("/users/:uid", verifyToken, async (req, res) => {
  const { uid } = req.params;
  const { users } = await getCollections();

  try {
    const user = await users.findOne({ uid });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch user", error: error.message });
  }
});

module.exports = router;
