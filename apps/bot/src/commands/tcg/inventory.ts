import { api, configService, ErrorMessages, Response } from '~/api';
import { inventoryMsg } from '~/messages';
import { formatMsg } from '~/utils';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('inventory').setDescription('Ver que tienes en tu inventario'),
  execute: async (interaction: CommandInteraction) => {
    const discordId = interaction.user.id;

    try {
      await interaction.deferReply({ ephemeral: true });

      // Check if user exists
      if (!discordId) {
        await interaction.editReply(ErrorMessages.User.NoUser);
        return;
      }

      const getInventoryResponse = await api.user.getInventory.query({ discordId });

      if (getInventoryResponse?.result.status === Response.ERROR) {
        await interaction.editReply(getInventoryResponse.result.error.message);
        return;
      }

      const coinEmoji = await configService.getGlobalConfig<string>('COIN_EMOJI', ':coin:');
      const gemEmoji = await configService.getGlobalConfig<string>('GEM_EMOJI', ':gem:');
      const boosterEmoji = await configService.getGlobalConfig<string>('BOOSTER_EMOJI', ':booster:');
      const msg = formatMsg(inventoryMsg.description, {
        userId: discordId,
        coins: getInventoryResponse.result.coins,
        gems: getInventoryResponse.result.gems,
        packs: getInventoryResponse.result.packs,
        coinEmoji,
        gemEmoji,
        boosterEmoji,
      });
      await interaction.editReply(msg);
    } catch (error) {
      console.error('Error getting inventory:', error);

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
      await interaction.editReply(ErrorMessages.Common.Unknown);
    }
  },
};

export default command;
