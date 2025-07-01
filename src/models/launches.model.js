// const launches = require('./launches.mongo');
const launches = new Map();

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

launches.set(launch.flightNumber, launch);

function existLaunchWithId(launchId) {
  return launches.has(launchId);
}

function getAllLaunches() {
  return Array.from(launches.values());
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
