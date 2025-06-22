const { getAllLaunches } = require("../../models/launches.model");
const { addNewLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.destination
  ) {
    return res.status(400).json({
      error: "Missing or invalid launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  const newLaunch = addNewLaunch(launch);
  return res.status(201).json(newLaunch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};
