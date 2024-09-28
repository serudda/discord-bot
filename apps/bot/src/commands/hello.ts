import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('hello').setDescription('Responde con el nombre del usuario'),
  execute: async (interaction: CommandInteraction) => {
    console.log('Hello command executed');
    await interaction.reply(`Hola ${interaction.user.username}!`);
  },
};

export default command;
