const fs = require("fs");
const { parse } = require("csv-parse");
const path = require("path");
const planets = require("./planets.mongo");
// destructre the function from the module imports

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#", // Ignores lines starting with '#'
          columns: true, // Converts rows to objects using the header row
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.error(err);
        reject(err);
      })
      .on("end", async() => {
        const planetsFound = (await getAllPlanets()).length;
        console.log(`${planetsFound} habitable planets found!!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find({});
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        planetName: planet.kepler_name,
      },
      {
        planetName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save a planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
