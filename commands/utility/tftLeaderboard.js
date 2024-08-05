const { SlashCommandBuilder } = require("discord.js");
const { Summoners } = require("../../database");
const { getSummonerPuuid } = require("../../api/riot_puuid");

const tierOrder = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
];
const rankOrder = ["IV", "III", "II", "I"];

async function getTftRank(summonerName, tag) {
  try {
    const response = await getSummonerPuuid(summonerName, tag);

    const rankedEntry = response.find(
      (entry) => entry.queueType === "RANKED_TFT",
    );
    return rankedEntry || null;
  } catch (error) {
    console.error(error);
  }
}
function formatRankTable(ranks) {
  const headers = ["Summoner", "Tier", "Rank", "LP", "Wins", "Losses"];
  const rows = ranks.map((rank) => [
    rank.summonerName,
    rank.tier,
    rank.rank,
    rank.leaguePoints.toString(),
    rank.wins.toString(),
    rank.losses.toString(),
  ]);

  const colWidths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map((row) => row[i].length)),
  );

  const formattedHeaders = headers
    .map((header, i) => header.padEnd(colWidths[i]))
    .join(" | ");
  const separator = colWidths.map((width) => "-".repeat(width)).join("-|-");
  const formattedRows = rows
    .map((row) => row.map((cell, i) => cell.padEnd(colWidths[i])).join(" | "))
    .join("\n");

  return `${formattedHeaders}\n${separator}\n${formattedRows}`;
}

function compareRanks(a, b) {
  const tierComparison = tierOrder.indexOf(b.tier) - tierOrder.indexOf(a.tier);
  if (tierComparison !== 0) return tierComparison;

  const rankComparison = rankOrder.indexOf(b.rank) - rankOrder.indexOf(a.rank);
  if (rankComparison !== 0) return rankComparison;

  return b.leaguePoints - a.leaguePoints; // Higher league points first
}
// function formatRankTable(ranks) {
//   let table = "Summoner        | Rank    | LP | Wins | Losses\n";
//   table += "----------------|---------|----|------|-------\n";
//
//   ranks.forEach((rank) => {
//     table += `${rank.summonerName} | ${rank.tier} ${rank.rank} | ${rank.leaguePoints} | ${rank.wins} | ${rank.losses}\n`;
//   });
//   return table;
// }
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tft_leaderboard")
    .setDescription("Display the TFT leaderboard for registered summoners"),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const summoners = await Summoners.findAll();
      const ranks = [];

      for (const summoner of summoners) {
        const { username, tag } = summoner.dataValues;
        const rank = await getTftRank(username, tag);
        if (rank) {
          ranks.push({
            summonerName: username,
            tier: rank.tier,
            rank: rank.rank,
            leaguePoints: rank.leaguePoints,
            wins: rank.wins,
            losses: rank.losses,
          });
        } else {
          ranks.push({
            summonerName: username,
            tier: "TRASH",
            rank: "TRASH",
            leaguePoints: "TRASH",
            wins: "TRASH",
            losses: "TRASH",
          });
        }
      }
      ranks.sort(compareRanks);
      const rankTable = formatRankTable(ranks);
      await interaction.editReply(`\`\`\`\n${rankTable}\n\`\`\``);
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "There was an error fetching the TFT Leaderboard",
      );
    }
  },
};
