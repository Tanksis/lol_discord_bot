const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  createSummonersModel,
  updateSummonerData,
  sequelize,
} = require("../../database");
const { getSummonerPuuid } = require("../../api/riot_puuid");
const compareRanks = require("./../../functions/compareRanks");
const { formatChange } = require("./../../functions/formatChange");

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
  const headers = ["Summoner", "Tier", "Rank", "LP", "W", "L"];
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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tft_leaderboard")
    .setDescription("Display the TFT leaderboard for registered summoners"),

  async execute(interaction) {
    await interaction.deferReply();

    const guildId = interaction.guild.id;
    const Summoners = createSummonersModel(guildId);
    try {
      await sequelize.sync();
      const summoners = await Summoners.findAll();
      const ranks = [];
      const changes = [];

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
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "There was an error fetching the TFT Leaderboard",
      );
    }
  },
};
