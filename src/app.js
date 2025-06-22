const express = require("express");
const morgan = require('morgan')
const cors = require("cors");
const { planetsRouter } = require("./routes/planets/planets.router");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan('combined'))

app.use(express.json());
app.use(planetsRouter);

module.exports = {
  app,
};
