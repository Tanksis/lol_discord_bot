const {
  getSummonerPuuid,
  getSummonerAccountId,
  getTftRank,
} = require("./riot_puuid.js");
require("dotenv").config();
const testName = "Tanksiss";

const testGetPuuid = async () => {
  try {
    const summonerData = await getSummonerPuuid(testName);
    console.log("puuid:", summonerData);

    if (summonerData) {
      const accountId = await getSummonerAccountId(summonerData);
      console.log("account id:", accountId);

      if (accountId) {
        const tftData = await getTftRank(accountId);
        console.log("tft data:", tftData);
      }
    } else {
      console.error("invalid summoner puuid");
    }
  } catch (error) {
    console.error("error fetching summoner puuid:", error);
  }
};

testGetPuuid();
