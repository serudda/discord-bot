import { ErrorCode, ErrorMessages } from '@discord-bot/error-handler';
import { api } from '../../api';
import { TRPCClientError } from '@trpc/client';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('wallet').setDescription('Ver la cantidad de monedas que tienes'),
  execute: async (interaction: CommandInteraction) => {
    const discordId = interaction.user.id;

    try {
      await interaction.deferReply();

      // Check if user exists
      if (!discordId) {
        await interaction.editReply(ErrorMessages.UserNotFound);
        return;
      }

      const response = await api.user.getCoins.query({ discordId });

      if (!response?.coins) {
        await interaction.editReply('No tienes monedas en tu billetera');
      } else {
        await interaction.editReply(`Tienes ${response.coins} monedas en tu billetera`);
      }
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
