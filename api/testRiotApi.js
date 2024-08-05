const { getSummonerPuuid } = require("./riot_puuid.js");
require("dotenv").config();
const testName = "Tanksiss";
const testTag = "NA1";
const testGetPuuid = async () => {
  try {
    const summonerData = await getSummonerPuuid(testName, testTag);
    console.log("tft rank:", summonerData);
  } catch (error) {
    console.error("error fetching summoner puuid:", error);
  }
};

testGetPuuid();
