const allowedOrigins = [
  "*",
  "https://ephemeral-chebakia-89a6e4.netlify.app",
  "https://vocal-fairy-59d1eb.netlify.app",
  "http://localhost:5174",
].filter(Boolean);

function corsOptions() {
  return {
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (!allowedOrigins.includes(origin)) {
        const message =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(message), false);
      }

      return callback(null, true);
    },
    credentials: true,
  };
}

module.exports = corsOptions;
