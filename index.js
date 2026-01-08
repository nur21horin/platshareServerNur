require("dotenv").config();

const app = require("./src/app");
const { ensureDbConnection } = require("./src/db/mongoClient");

const port = process.env.PORT || 3000;

const dbReady = ensureDbConnection();

// dbReady.catch((error) => {
//   console.error("MongoDB connection failed:", error);
// });

ensureDbConnection()
  .then(() => {
    console.log("MongoDB connected successfully");

    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  })
  .catch((error) => {
    console.error("Failed to start server due to DB connection error:", error);
  });

// module.exports = app;
