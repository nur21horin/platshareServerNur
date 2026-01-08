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

const serverless = require("serverless-http");
const app = require("../src/app");
const { ensureDbConnection } = require("../src/db/mongoClient");

const handler = async (req, res) => {
  try {
    await ensureDbConnection(); // make sure DB is connected
    return app(req, res);
  } catch (error) {
    console.error("API handler failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// **THIS is the export Vercel needs**
module.exports = serverless(handler);
