const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Summoners = sequelize.define("summoners", {
  username: Sequelize.STRING,
  tag: Sequelize.STRING,
  tier: Sequelize.STRING,
  rank: Sequelize.STRING,
  leaguePoints: Sequelize.STRING,
  wins: Sequelize.INTEGER,
  losses: Sequelize.INTEGER,
});

const initializeDatabase = async () => {
  await sequelize.sync();
  console.log("database synced");
};

const updateSummonerData = async ({
  username,
  tag,
  tier,
  rank,
  leaguePoints,
  wins,
  losses,
}) => {
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

const printData = async () => {
  try {
    await sequelize.sync();

    const summoners = await Summoners.findAll();

    console.log("Summoners in the database:");
    summoners.forEach((summoner, index) => {
      console.log(`${index + 1}: ${summoner.username} - ${summoner.tag}`);
    });
  } catch (error) {
    console.error("error querying database", error);
  }
};

printData();
module.exports = {
  Summoners,
  sequelize,
  initializeDatabase,
  updateSummonerData,
};
