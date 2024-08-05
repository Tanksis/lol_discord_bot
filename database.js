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
});

const initializeDatabase = async () => {
  await sequelize.sync();
  console.log("database synced");
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
module.exports = { Summoners, sequelize, initializeDatabase };
