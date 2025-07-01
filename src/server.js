const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 8000;

const { loadPlanetsData } = require("./models/planets.model");

const MONGO_URL =
  "mongodb+srv://NASA_API:2YzydGtCVjJPJyUw@cluster0.mkccrjq.mongodb.net/nasa-api?retryWrites=true&w=majority&appName=Cluster0";

const server = http.createServer(app);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");

    await loadPlanetsData();

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.error("MongoDB connection error", err);
  }
}


startServer();
