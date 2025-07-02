const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
// const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("July 20, 2030"),
  target: "Kepler-442 b",
  customers: ["NASA", "ISRO"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

function existLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function getAllLaunches() {
  return await launches.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    planetName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  const newLaunch = {
    ...launch,
    flightNumber: latestFlightNumber,
    upcoming: true,
    success: true,
    customers: ["ISRO", "NASA"],
  };
  //   console.log(newLaunch);
  launches.set(latestFlightNumber, newLaunch);
  return newLaunch;
}

function abortLaunchById(launchId) {
  const abortLaunch = launches.get(launchId);
  abortLaunch.upcoming = false;
  abortLaunch.success = false;

  return abortLaunch;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
  existLaunchWithId,
};
