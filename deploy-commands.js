const { REST, Routes } = require("discord.js");
require("dotenv").config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_API_KEY;
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
//grab all commands
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  //grab all command files from command directory
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  //grabs the output of each commands data for deployement
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `WARNING: the command at ${filePath} is missing a required "data" or "execute" property`,
      );
    }
  }
}

//construct instance of REST module
const rest = new REST().setToken(token);

//deploy commands
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    //refresh all commands in guild
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      Routes.applicationCommands(guildId),
      { body: commands },
    );

    console.log(
      `Succesfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
