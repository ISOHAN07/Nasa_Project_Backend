const {
  getAllLaunches,
  abortLaunchById,
  scheduleLaunch,
} = require("../../models/launches.model");
const { existLaunchWithId } = require("../../models/launches.model");

const {getPagination} = require('../../services/query')

async function httpGetAllLaunches(req, res) {
  const {skip, limit} = getPagination(req.query);
  return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
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

  const newLaunch = await scheduleLaunch(launch);
  return res.status(201).json(newLaunch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  const existLaunch = await existLaunchWithId(launchId);

  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const abortLaunch = await abortLaunchById(launchId);
  if (!abortLaunch) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
