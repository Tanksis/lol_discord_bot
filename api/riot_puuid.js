const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const api_key = process.env.RIOT_API_KEY;
const getSummonerPuuid = async (summonerName) => {
  try {
    const response = await axios.get(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/NA1`,
      {
        headers: {
          "X-Riot-Token": api_key,
        },
      },
    );
    return response.data.puuid;
  } catch (error) {
    console.error(error);
  }
};

const getSummonerAccountId = async (puuid) => {
  try {
    const response = await axios.get(
      `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}`,
      {
        headers: {
          "X-Riot-Token": api_key,
        },
      },
    );
    return response.data.id;
  } catch (error) {
    console.error(error);
  }
};

const getTftRank = async (account_id) => {
  try {
    const response = await axios.get(
      `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${account_id}`,
      {
        headers: {
          "X-Riot-Token": api_key,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
module.exports = { getSummonerPuuid, getSummonerAccountId, getTftRank };
