const { getCollections, ObjectId } = require("../db/mongoClient");

async function createRequest(req, res) {
  const { food_id: foodId, user_name: userName } = req.body ?? {};
  const userEmail = req.user?.email;

  if (!foodId || !userEmail || !userName) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    const { foods, requests } = await getCollections();
    const food = await foods.findOne({
      _id: new ObjectId(foodId),
      food_status: "Available",
    });

    if (!food) {
      return res.status(404).send({ message: "Food not available" });
    }

    const existingRequest = await requests.findOne({
      food_id: foodId,
      user_email: userEmail,
    });

    if (existingRequest) {
      return res.status(409).send({ message: "Already requested this food" });
    }

    const requestDoc = {
      food_id: foodId,
      user_name: userName,
      user_email: userEmail,
      requested_at: new Date(),
      status: "Pending",
    };

    const result = await requests.insertOne(requestDoc);

    return res.status(201).send({
      message: "Request submitted successfully",
      requestId: result.insertedId,
    });
  } catch (error) {
    return res.status(500).send({ message: "Failed to submit request", error });
  }
}

async function deleteRequest(req, res) {
  const { id } = req.params;

  try {
    const { requests } = await getCollections();
    const result = await requests.deleteOne({
      _id: new ObjectId(id),
      user_email: req.user.email,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send({ message: "Request not found or unauthorized" });
    }

    return res.send({ message: "Request deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Failed to delete request", error });
  }
}

async function getRequestsByEmail(req, res) {
  const { email } = req.params;

  if (email !== req.user.email) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }

  try {
    const { requests } = await getCollections();
    const result = await requests.find({ user_email: req.user.email }).toArray();
    return res.send(result);
  } catch (error) {
    return res.status(500).send({ message: "Failed to fetch requests", error });
  }
}

async function updateRequestStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body ?? {};

  if (!["Accepted", "Rejected"].includes(status)) {
    return res.status(400).send({ message: "Invalid status" });
  }

  try {
    const { foods, requests } = await getCollections();
    const request = await requests.findOne({ _id: new ObjectId(id) });

    if (!request) {
      return res.status(404).send({ message: "Request not found" });
    }

    const food = await foods.findOne({
      _id: new ObjectId(request.food_id),
    });

    if (!food || food.donator_email !== req.user.email) {
      return res
        .status(403)
        .send({ message: "Forbidden: Only owner can update" });
    }

    await requests.updateOne({ _id: new ObjectId(id) }, { $set: { status } });

    if (status === "Accepted") {
      await foods.updateOne(
        { _id: new ObjectId(request.food_id) },
        { $set: { food_status: "Donated" } }
      );
    }

    return res.send({ message: `Request ${status.toLowerCase()} successfully.` });
  } catch (error) {
    return res.status(500).send({ message: "Failed to update request", error });
  }
}

module.exports = {
  createRequest,
  deleteRequest,
  getRequestsByEmail,
  updateRequestStatus,
};

