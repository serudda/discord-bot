import type { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Responde con Pong!'),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply('Pong!');
  },
};

export default command;
