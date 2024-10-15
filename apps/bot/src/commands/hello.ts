import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('hello').setDescription('Responde con el nombre del usuario'),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply(`Hola ${interaction.user.username}!`);
  },
};

export default command;
