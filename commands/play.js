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

    // User must be in VC
    if (!voiceChannel) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} You need to be in a voice channel to use this command!`)],
        ephemeral: true
      });
    }

    // Check bot permissions
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} I need permissions to join and speak in your voice channel!`)],
        ephemeral: true
      });
    }

    // Acknowledge interaction
    await interaction.deferReply();

    try {
      // Play directly, don't manually check getQueue or join VC
      await interaction.client.distube.play(voiceChannel, query, {
        member: interaction.member,
        textChannel: interaction.channel,
        metadata: { interaction }
      });

      // Send searching embed
      await interaction.editReply({ 
        embeds: [infoEmbed(`${emojis.search} Searching for: \`${query}\``)]
      });

    } catch (error) {
      console.error('[DisTube Play Error]', error);
      await interaction.editReply({
        embeds: [errorEmbed(`${emojis.error} Error playing music: ${error.message}`)]
      });
    }
  }
};
