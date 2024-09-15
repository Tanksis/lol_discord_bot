# TFTally - Discord Bot for TFT Leaderboard Tracking

TFTally is a Discord Bot built using [discord.js](https://discord.js.org) that
allows you to create a personal leaderboard for your channel to compare whos
better!

## Getting Started

### [Install TFTally](https://discord.com/oauth2/authorize?client_id=1270019786415407255&permissions=0&integration_type=0&scope=bot+applications.commands) on your discord server

## Features

- **TFT Leaderboard Command**: Retrieves and displays the current TFT
  leaderboard rankings.
- **Database Integration**: Utilizes MariaDB to store individual leaderboards
  based off your Discord guild.
- **Formatted Output**: Presents summoner statistics in a clear, sorted and
  readable table format.

## Commands

- **/tft_leaderboard**: Fetches and displays the TFT leaderboard. Provides
  updates since last call.

![Image of Leaderboard](./images/leaderboard.png)

- **/addaccount**: Opens a modal allowing you to insert summoners into the
  guilds leaderboard, given the summoner name and respective tag. (EG.
  Tanksiss#NA1)

![Image of add_account](./images/add_account.png)

## Development

- **SQLite to MariaDB Migration**: Initial development used SQLite, but migration to MariaDB/MySQL was implemented for handling multiple Discord guilds and scaling.
- **Sorting Algorithm**: Developed a custom algorithm to sort summoners based on tier, rank, and LP.
- **Testing**: Created unit tests using Jest to verify the functionality of comparison operations.

## Stack

- **Node.js**: JavaScript runtime used for building the bot.
- **Discord.js**: Library for interacting with the Discord API and managing bot functionality.
- **MariaDB/MySQL**: Relational database used for scalable data management.
- **SQLite**: Initially used for data storage before migrating to MariaDB/MySQL.
- **Jest**: Testing framework for writing and running unit tests.
