const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

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

async function existLaunchWithId(launchId) {
  return await launches.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches
    .findOne() // returns the first flightNumber after sorting
    .sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
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

  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLauch = {
    ...launch,
    flightNumber: newFlightNumber,
    upcoming: true,
    success: true,
    customers: ["ISRO", "NASA"],
  };

  await saveLaunch(newLauch);
  return newLauch;
}

async function abortLaunchById(launchId) {
  const abortLaunch = await launches.findOneAndUpdate(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }, {
      new: true,
    }
  );

  return abortLaunch;
}

module.exports = {
  getAllLaunches,
  abortLaunchById,
  existLaunchWithId,
  scheduleLaunch,
};
