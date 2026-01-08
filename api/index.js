// const app = require("../src/app");
// const { ensureDbConnection } = require("../src/db/mongoClient");

// module.exports = async (req, res) => {
//   try {
//     await ensureDbConnection();
//     return app(req, res);
//   } catch (error) {
//     console.error("API handler failed:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

require("dotenv").config();
const app = require("../src/app");
const { ensureDbConnection } = require("../src/db/mongoClient");

module.exports = async (req, res) => {
  try {
    await ensureDbConnection(); // Make sure MongoDB is ready
    app(req, res); // Pass the request to your Express app
  } catch (error) {
    console.error("API handler failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
