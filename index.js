/**
 * Discord DisTube Music Bot
 * Made by Friday and Powered By Cortex Realm
 * Support Server: https://discord.gg/EWr3GgP6fe
 */

require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { emojis } = require('./config/emojis');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic route so Render detects a port
app.get('/', (req, res) => {
  res.send('Bot is running smoothly ✅');
});

// Start the HTTP server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});

// Your Discord bot code below:
const Discord = require('discord.js');
const Bot = new Discord.Client();
// (Your music plugin and bot.login logic)

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Create collections for commands
client.commands = new Collection();

// Initialize DisTube
client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  plugins: [
    new SpotifyPlugin({}),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ]
});

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// Deploy slash commands
const deployCommands = async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(process.env.TOKEN);
    
    // The put method is used to fully refresh all commands globally
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
};

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// DisTube events
const { handleDistubeEvents } = require('./utils/distubeEvents');
handleDistubeEvents(client);

// Deploy commands and then log in to Discord
(async () => {
  await deployCommands();
  client.login(process.env.TOKEN);
})(); 
