const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 8000;

const { loadPlanetsData } = require("./models/planets.model");

const MONGO_URL =
  "mongodb+srv://NASA_API:2YzydGtCVjJPJyUw@cluster0.mkccrjq.mongodb.net/nasa?retryWrites=true&w=majority&appName=Cluster0";

const server = http.createServer(app);

async function startServer() {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error", err));
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
