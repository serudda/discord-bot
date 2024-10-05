import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('buy-pack').setDescription('Compra un sobre de 5 cartas'),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply(`${interaction.user.username} compró un sobre de 5 cartas`);
  },
};

export default command;
