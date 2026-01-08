const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const routes = require("./routes");

const app = express();

app.use(cors(corsOptions()));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SharePlate Server is Running...");
});

app.use(routes);

module.exports = app;

