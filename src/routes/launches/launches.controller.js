const { getAllLaunches } = require("../../models/launches.model");
const { addNewLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req,res){
    const launch = req.body;
    launch.launchDate = new Date(launch.launchDate)

    const newLaunch = addNewLaunch(launch);
    return res.status(201).json(newLaunch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};
