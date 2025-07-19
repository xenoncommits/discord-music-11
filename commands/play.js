const { SlashCommandBuilder } = require('@discordjs/builders');
const { infoEmbed, errorEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or playlist')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The song URL or search query')
        .setRequired(true)),
  
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;
    
    if (!voiceChannel) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} You need to be in a voice channel to use this command!`)], 
        ephemeral: true 
      });
    }

    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} I need permissions to join and speak in your voice channel!`)], 
        ephemeral: true 
      });
    }

    await interaction.deferReply();

    try {
      // Show "Searching..." message before playing
      await interaction.editReply({ 
        embeds: [infoEmbed(`${emojis.search} Searching for: \`${query}\``)]
      });

      await interaction.client.distube.play(voiceChannel, query, {
        member: interaction.member,
        textChannel: interaction.channel,
        metadata: { interaction }
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ 
        embeds: [errorEmbed(`${emojis.error} Error playing music: ${error.message}`)]
      });
    }
  },
};
