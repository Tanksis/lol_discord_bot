const {
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addaccount")
    .setDescription("Adds new account to TFT Ranked Leaderboard"),
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("myModal")
      .setTitle("Provide User Information");

    const summonerNameInput = new TextInputBuilder()
      .setCustomId("summonerNameInput")
      .setLabel("Whats your summoner name?")
      .setStyle(TextInputStyle.Short);

    const tagLineInput = new TextInputBuilder()
      .setCustomId("tagLineInput")
      .setLabel("Whats your tag? (eg: NA1)")
      .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(
      summonerNameInput,
    );
    const secondActionRow = new ActionRowBuilder().addComponents(tagLineInput);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
  },
};
