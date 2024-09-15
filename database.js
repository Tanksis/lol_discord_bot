const Sequelize = require("sequelize");
require("dotenv").config();

/* const PASSWORD = process.env.DB_PASSWORD; */
const HOST = process.env.HOST;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;
const PORT = process.env.PORT;

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  port: PORT,
  dialect: "mariadb",
  logging: false,
});

const createSummonersModel = (guildId) => {
  return sequelize.define(`summoners_${guildId}`, {
    username: Sequelize.STRING,
    tag: Sequelize.STRING,
    tier: Sequelize.STRING,
    rank: Sequelize.STRING,
    leaguePoints: Sequelize.INTEGER,
    wins: Sequelize.INTEGER,
    losses: Sequelize.INTEGER,
  });
};

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MariaDB");
    await sequelize.sync();
    console.log("database synced");
  } catch (error) {
    console.error("Unable to connect to Database:", error);
  }
};

const updateSummonerData = async (
  guildId,
  { username, tag, tier, rank, leaguePoints, wins, losses },
) => {
  const Summoners = createSummonersModel(guildId);
  try {
    const [summoner, created] = await Summoners.findOrCreate({
      where: { username, tag },
      defaults: {
        tier,
        rank,
        leaguePoints,
        wins,
        losses,
      },
    });

    if (!created) {
      summoner.tier = tier;
      summoner.rank = rank;
      summoner.leaguePoints = leaguePoints;
      summoner.wins = wins;
      summoner.losses = losses;
      await summoner.save();
    }
  } catch (error) {
    console.error("Error updating summoner data:", error);
  }
};
//
// const printData = async () => {
//   try {
//     await sequelize.sync();
//
//     const summoners = await Summoners.findAll();
//
//     console.log("Summoners in the database:");
//     summoners.forEach((summoner, index) => {
//       console.log(`${index + 1}: ${summoner.username} - ${summoner.tag}`);
//     });
//   } catch (error) {
//     console.error("error querying database", error);
//   }
// };

/* printData(); */
module.exports = {
  createSummonersModel,
  sequelize,
  initializeDatabase,
  updateSummonerData,
};
