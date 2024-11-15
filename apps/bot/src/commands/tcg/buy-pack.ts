import { api, ErrorMessages, Response } from '~/api';
import { buyPackMsg } from '~/messages';
import { formatMsg } from '~/utils';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('buy-pack').setDescription('Compra un sobre de 3 cartas'),
  execute: async (interaction: CommandInteraction) => {
    const discordId = interaction.user.id;

    try {
      await interaction.deferReply();
      const response = await api.pack.buyPack.mutate({ discordId });

      if (response.result.status === Response.ERROR) {
        await interaction.editReply(response.result.error.message);
        return;
      }

      const packs = response?.result.amountOfPacks;
      const msg = formatMsg(buyPackMsg.description, {
        discordId,
        packs,
      });
      await interaction.editReply(msg);
    } catch (error) {
      console.error('Error buying a pack', error);
      if (error instanceof TRPCClientError) await interaction.editReply(error);
      await interaction.editReply(ErrorMessages.Common.Unknown);
    }
  },
};

export default command;
