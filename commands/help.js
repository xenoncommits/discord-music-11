/**
 * Help command
 * Made by Friday and Powered By Cortex Realm
 * Support Server: https://discord.gg/EWr3GgP6fe
 */

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available music commands'),
  
  async execute(interaction) {
    // Group commands by category for better organization
    const playbackCommands = [
      `${emojis.play} \`/play\` - Play a song or playlist`,
      `${emojis.pause} \`/pause\` - Pause the current song`,
      `${emojis.play} \`/resume\` - Resume playback`,
      `${emojis.skip} \`/skip\` - Skip to the next song`,
      `${emojis.stop} \`/stop\` - Stop and clear the queue`
    ].join('\n');
    
    const queueCommands = [
      `${emojis.queue} \`/queue\` - View the current queue`,
      `${emojis.music} \`/nowplaying\` - Show current song details`,
      `${emojis.shuffle} \`/shuffle\` - Shuffle the queue`
    ].join('\n');
    
    const settingsCommands = [
      `${emojis.volume} \`/volume\` - Adjust volume (0-100%)`,
      `${emojis.repeat} \`/loop\` - Set loop mode (Off/Song/Queue)`,
      `${emojis.help} \`/help\` - Show this help menu`
    ].join('\n');
    
    // Create a more visually appealing embed
    const embed = new EmbedBuilder()
      .setColor('#9B59B6')
      .setAuthor({ 
        name: 'Music Bot Help',
        iconURL: 'https://i.imgur.com/tQfGnLe.png'
      })
      .setTitle(`${emojis.headphones} Available Commands`)
      .setDescription('Enjoy music with these easy-to-use commands!')
      .addFields(
        { name: `${emojis.play} Playback Controls`, value: playbackCommands, inline: false },
        { name: `${emojis.queue} Queue Management`, value: queueCommands, inline: false },
        { name: `${emojis.settings} Settings`, value: settingsCommands, inline: false }
      )
      .setFooter({ 
        text: `Requested by ${interaction.user.username} • Use /play to start listening!`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp()
      .setThumbnail('https://i.imgur.com/tQfGnLe.png');
    
    // Add interactive buttons
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('support')
          .setLabel('Support Server')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🔧'),
        new ButtonBuilder()
          .setCustomId('invite')
          .setLabel('Invite Bot')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('➕')
      );
    
    await interaction.reply({ 
      embeds: [embed],
      components: [row]
    });
  },
}; 