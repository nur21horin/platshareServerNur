const { getCollections } = require("../db/mongoClient");

async function getDashboardStats(req, res) {
  try {
    const { foods, users } = await getCollections();

    const totalUsers = await users.countDocuments();
    const totalMeals = await foods.countDocuments();

    const availableFoods = await foods.countDocuments({
      food_status: "Available",
    });

    const collectedFoods = await foods.countDocuments({
      food_status: "Donated",
    });

    const expiredFoods = await foods.countDocuments({
      food_status: "Expired",
    });

    const totalWasteReduced = collectedFoods * 2;
    const partnerOrganizations = 10;

    const mealsPerMonthRaw = await foods
      .aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const mealsPerMonth = mealsPerMonthRaw.map((item) => ({
      month: new Date(0, item._id - 1).toLocaleString("default", {
        month: "short",
      }),
      count: item.count,
    }));

    res.send({
      totalUsers,
      totalMeals,
      totalWasteReduced,
      partnerOrganizations,
      availableFoods,
      collectedFoods,
      expiredFoods,
      mealsPerMonth,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to load dashboard stats",
      error: error.message,
    });
  }
}

// 👇 Separate controllers
async function getDashboardUsers(req, res) {
  try {
    const { users } = await getCollections();
    const result = await users.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to load users" });
  }
}

async function getDashboardFoods(req, res) {
  try {
    const { foods } = await getCollections();
    const result = await foods.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to load foods" });
  }
}

module.exports = {
  getDashboardStats,
  getDashboardUsers,
  getDashboardFoods,
};
