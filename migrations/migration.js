"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("summoners", "tier", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("summoners", "rank", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("summoners", "leaguePoints", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("summoners", "wins", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("summoners", "losses", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("summoners", "tier");
    await queryInterface.removeColumn("summoners", "rank");
    await queryInterface.removeColumn("summoners", "leaguePoints");
    await queryInterface.removeColumn("summoners", "wins");
    await queryInterface.removeColumn("summoners", "losses");
  },
};
