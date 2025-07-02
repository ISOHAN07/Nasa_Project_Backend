const { getAllLaunches, abortLaunchById } = require("../../models/launches.model");
const {
  addNewLaunch,
  existLaunchWithId,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
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

function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  if (!existLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const abortLaunch = abortLaunchById(launchId);
  return res.status(200).json(abortLaunch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
