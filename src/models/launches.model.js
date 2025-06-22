const launches = new Map();

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

module.exports = {
    launches,
}