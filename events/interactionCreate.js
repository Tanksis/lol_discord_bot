const { Events } = require("discord.js");
const { createSummonersModel } = require("../database");
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `no command matching ${interaction.commandName} was found.`,
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error executing this command!",
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "myModal") {
        const summonerName =
          interaction.fields.getTextInputValue("summonerNameInput");
        const tagLine = interaction.fields.getTextInputValue("tagLineInput");

        const guildId = interaction.guild.id;

        const Summoners = createSummonersModel(guildId);

        try {
          const account = await Summoners.create({
            username: summonerName,
            tag: tagLine,
          });

          await interaction.reply({
            content: "Your submission was received succesfully!",
          });
        } catch (error) {
          return interaction.reply("something went wrong", error);
        }
      }
    }
  },
};
