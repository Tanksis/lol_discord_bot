const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Summoners, updateSummonerData } = require("../../database");
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

function formatChange(oldRank, newRank, summonerName) {
  const oldTierIndex = tierOrder.indexOf(oldRank.tier);
  const newTierIndex = tierOrder.indexOf(newRank.tier);
  const oldRankIndex = rankOrder.indexOf(oldRank.rank);
  const newRankIndex = rankOrder.indexOf(newRank.rank);

  let changeMessage = "";

  if (newTierIndex < oldTierIndex) {
    changeMessage += `\`\`\`diff\n+${oldTierIndex - newTierIndex} Tier(s) (${summonerName})\n\`\`\``;
  } else if (newTierIndex > oldTierIndex) {
    changeMessage += `\`\`\`diff\n-${newTierIndex - oldTierIndex} Tier(s) (${summonerName})\n\`\`\``;
  }

  if (newRankIndex < oldRankIndex) {
    changeMessage += `\`\`\`diff\n+${oldRankIndex - newRankIndex} Rank(s) (${summonerName})\n\`\`\``;
  } else if (newRankIndex > oldRankIndex) {
    changeMessage += `\`\`\`diff\n-${newRankIndex - oldRankIndex} Rank(s) (${summonerName})\n\`\`\``;
  }

  const lpChange = (newRank.leaguePoints || 0) - (oldRank.leaguePoints || 0);
  if (lpChange !== 0) {
    const sign = lpChange >= 0 ? "+" : "-";
    changeMessage += `\`\`\`diff\n${sign}${Math.abs(lpChange)} LP (${summonerName})\n\`\`\``;
  }

  return changeMessage || null;
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tft_leaderboard")
    .setDescription("Display the TFT leaderboard for registered summoners"),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const summoners = await Summoners.findAll();
      const ranks = [];
      const changes = [];
      let hasChanges = false;

      for (const summoner of summoners) {
        const { username, tag } = summoner.dataValues;
        const rank = await getTftRank(username, tag);
        const oldData = summoner.dataValues;
        if (rank) {
          const newRank = {
            summonerName: username,
            tier: rank.tier,
            rank: rank.rank,
            leaguePoints: rank.leaguePoints,
            wins: rank.wins,
            losses: rank.losses,
            tag,
          };

          ranks.push(newRank);

          const changeMessage = formatChange(oldData, newRank, username);
          if (changeMessage) {
            changes.push(changeMessage);
            hasChanges = true;
          }
        } else {
          ranks.push({
            summonerName: username,
            tier: "TRASH",
            rank: "V",
            leaguePoints: "0",
            wins: "0",
            losses: "0",
            tag,
          });
        }
      }
      ranks.sort(compareRanks);
      const rankTable = formatRankTable(ranks);
      const formattedTable = `\`\`\`\n${rankTable}\n\`\`\``;

      const embed = new EmbedBuilder()
        .setTitle("Top TFT Summoners")
        .setColor(9442302)
        .setTimestamp()
        .addFields({
          name: "Here are the latest rankings:",
          value: formattedTable,
        })
        .addFields({
          name: "Changes since last launch:",
          value: changes.length > 0 ? changes.join("\n") : "No changes",
          inline: true,
        });

      await interaction.editReply({
        embeds: [embed],
        ephemeral: true,
      });

      for (const rank of ranks) {
        await updateSummonerData({
          username: rank.summonerName,
          tier: rank.tier,
          rank: rank.rank,
          leaguePoints: rank.leaguePoints,
          wins: rank.wins,
          losses: rank.losses,
          tag: rank.tag,
        });
      }
      console.log(changes);
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "There was an error fetching the TFT Leaderboard",
      );
    }
  },
};
