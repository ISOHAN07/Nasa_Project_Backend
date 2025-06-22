const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("July 20, 2030"),
  destination: "Kepler-442 b",
  customers: ["NASA", "ISRO"],
  isUpcoming: true,
  isSuccess: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  const newLaunch = {
    ...launch,
    flightNumber: latestFlightNumber,
    isUpcoming: true,
    isSuccess: true,
    customers: ["ISRO", "NASA"]
  };
//   console.log(newLaunch);
  launches.set(latestFlightNumber, newLaunch);
  return newLaunch;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
};
