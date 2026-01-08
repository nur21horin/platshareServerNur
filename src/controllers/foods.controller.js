const { getCollections, ObjectId } = require("../db/mongoClient");

async function createFood(req, res) {
  try {
    const { foods } = await getCollections();
    const food = {
      ...req.body,
      food_status: "Available",
      donator_email: req.user.email,
    };

    const result = await foods.insertOne(food);
    return res.status(201).send(result);
  } catch (error) {
    return res.status(500).send({ message: "Failed to add food", error });
  }
}

async function updateFood(req, res) {
  const { id } = req.params;
  const { _id, ...updatedFood } = req.body ?? {};

  try {
    const { foods } = await getCollections();
    const food = await foods.findOne({ _id: new ObjectId(id) });

    if (!food) {
      return res.status(404).send({ message: "Food not found" });
    }

    if (food.donator_email !== req.user.email) {
      return res
        .status(403)
        .send({ message: "Forbidden: Only owner can update" });
    }

    const result = await foods.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFood }
    );

    return res.send({ message: "Food updated successfully", result });
  } catch (error) {
    return res.status(500).send({ message: "Failed to update food", error });
  }
}

async function deleteFood(req, res) {
  const { id } = req.params;

  try {
    const { foods } = await getCollections();
    const food = await foods.findOne({ _id: new ObjectId(id) });

    if (!food) {
      return res.status(404).send({ message: "Food not found" });
    }

    const isOwner = food.donator_email === req.user.email;
    const isAdmin = req.user.role === "admin";

    if (!isOwner || !isAdmin) {
      return res
        .status(403)
        .send({ message: "Forbidden: Not allowed to delete" });
    }

    await foods.deleteOne({ _id: new ObjectId(id) });
    return res.send({ message: "Food deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Failed to delete food", error });
  }
}

async function getAvailableFoods(req, res) {
  try {
    const { foods } = await getCollections();
    const query = {};
    if(req.query.user){
      query.donator_email=req.query.user;
    }
    const result = await foods.find({ food_status: "Available" }).toArray();
    return res.send(result);
  } catch (error) {
    return res.status(500).send({ message: "Failed to fetch foods", error });
  }
}

async function getFeaturedFoods(req, res) {
  try {
    const { foods } = await getCollections();
    const result = await foods
      .find({ food_status: "Available", featured: true })
      .limit(6)
      .toArray();

    return res.send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to fetch featured foods", error });
  }
}

async function getFoodById(req, res) {
  const { id } = req.params;

  try {
    const { foods } = await getCollections();
    const food = await foods.findOne({ _id: new ObjectId(id) });

    if (!food) {
      return res.status(404).send({ message: "Food not found" });
    }

    return res.send(food);
  } catch (error) {
    return res.status(500).send({ message: "Invalid ID format", error });
  }
}

async function getMyFoods(req, res) {
  const { email } = req.params;

  if (email !== req.user.email) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }

  try {
    const { foods } = await getCollections();
    const result = await foods
      .find({ donator_email: req.user.email })
      .toArray();

    return res.send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to fetch user foods", error });
  }
}

module.exports = {
  createFood,
  updateFood,
  deleteFood,
  getAvailableFoods,
  getFeaturedFoods,
  getFoodById,
  getMyFoods,
};
