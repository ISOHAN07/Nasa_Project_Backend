const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer IS1", // in rocket.name
  launchDate: new Date("July 20, 2030"), //date_local
  target: "Kepler-442 b", //NA
  customers: ["NASA", "ISRO"], // from payload.customers for each payload
  upcoming: true, // upcoming
  success: true, // success
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function downloadLaunch() {
  console.log("downloading launch data");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if(response.status !== 200){
    console.log('Problem loading the downloaded data');
    throw new Error('Launch data download failed!');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      customers,
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
    };
    console.log(`${launch.flightNumber} and ${launch.mission}`);

    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Already exists!");
  } else {
    await downloadLaunch();
  }
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existLaunchWithId(launchId) {
  return await findLaunch({
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

async function getAllLaunches(skip, limit) {
  return await launches.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  )
  .skip(skip)
  .limit(limit);
}

async function saveLaunch(launch) {
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
  const planet = await planets.findOne({
    planetName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

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
    },
    {
      new: true,
    }
  );

  return abortLaunch;
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  abortLaunchById,
  existLaunchWithId,
  scheduleLaunch,
};
