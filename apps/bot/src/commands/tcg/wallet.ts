import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, Response } from '~/api';
import { walletMsg } from '~/messages';
import { formatMsg } from '~/utils';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('wallet').setDescription('Ver la cantidad de monedas que tienes'),
  execute: async (interaction: CommandInteraction) => {
    const discordId = interaction.user.id;

    try {
      await interaction.deferReply({ ephemeral: true });

      // Check if user exists
      if (!discordId) {
        await interaction.editReply(ErrorMessages.UserNotFound);
        return;
      }

      const response = await api.user.getCoins.query({ discordId });

      if (response?.result.status === Response.ERROR) {
        await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);
        return;
      }

      // Check if user has coins
      if (!response?.result || !response.result.coins) {
        await interaction.editReply(ErrorMessages.NoCoins);
        return;
      }

      const msg = formatMsg(walletMsg.description, {
        userId: discordId,
        coins: response.result.coins,
      });
      await interaction.editReply(msg);
    } catch (error) {
      console.error('Error getting wallet:', error);

      if (error instanceof TRPCClientError) {
        if (error.message.includes('ECONNREFUSED')) {
          await interaction.editReply(
            'El servidor no está disponible en este momento. Por favor, inténtalo más tarde.',
          );
          return;
        }

        // Other tRPC errors
        await interaction.editReply(error.message);
        return;
      }

      // Unknown error
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
