import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, Response } from '~/api';
import { buyPackMsg } from '~/messages';
import { formatMsg } from '~/utils';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('buy-pack').setDescription('Compra un sobre de 3 cartas'),
  execute: async (interaction: CommandInteraction) => {
    const discordId = interaction.user.id;

    console.log('**DISCORD ID**', discordId);

    try {
      await interaction.deferReply();
      const response = await api.pack.buyPack.mutate({ discordId });

      if (response?.result?.status === Response.ERROR) {
        await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);
        return;
      }

      const packs = response?.result.amountOfPacks as number;
      const coins = response?.result.coins as number;
      const msg = formatMsg(buyPackMsg.description, {
        coins,
        packs,
      });
      await interaction.editReply(msg);
    } catch (error) {
      console.error('Error buying a pack', error);
      if (error instanceof TRPCClientError) await interaction.editReply(error);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
