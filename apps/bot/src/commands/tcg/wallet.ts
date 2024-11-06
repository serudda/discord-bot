import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, configService, Response } from '~/api';
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

      const response = await api.user.getInventory.query({ discordId });

      if (response?.result.status === Response.ERROR) {
        await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);
        return;
      }

      // Check if user has coins
      if (!response?.result || !response.result.coins || !response.result.gems || !response.result.packs) {
        await interaction.editReply(ErrorMessages.NoCoins);
        return;
      }

      const coinEmoji = await configService.getGlobalConfig<string>('COIN_EMOJI', ':coin:');
      const gemEmoji = await configService.getGlobalConfig<string>('GEM_EMOJI', ':gem:');
      const boosterEmoji = await configService.getGlobalConfig<string>('BOOSTER_EMOJI', ':booster:');
      const msg = formatMsg(walletMsg.description, {
        userId: discordId,
        coins: response.result.coins,
        gems: response.result.gems,
        packs: response.result.packs.length,
        coinEmoji,
        gemEmoji,
        boosterEmoji,
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
