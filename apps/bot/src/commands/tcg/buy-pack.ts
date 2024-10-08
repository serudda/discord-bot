import { Card } from '@discord-bot/db';
import { ErrorCode, ErrorMessages } from '@discord-bot/error-handler';
import { api, Response } from '../../api';
import { TRPCClientError } from '@trpc/client';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('buy-pack').setDescription('Compra un sobre de 3 cartas'),
  execute: async (interaction: CommandInteraction) => {
    const discordId = interaction.user.id;

    try {
      await interaction.deferReply();
      const response = await api.card.buyPack.mutate({ discordId });

      if (response?.result?.status === Response.ERROR)
        await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);

      if (response?.result.status === Response.SUCCESS) {
        const { cards } = response.result;
        if (cards && cards.length > 0) {
          let response = '🎉 ¡Has comprado un paquete y obtenido las siguientes cartas! 🎉\n';
          cards.forEach((card?: Card) => {
            response += `- **${card?.name}** (Rareza: ${card?.rarity})\n`;
          });
          await interaction.editReply(response);
        } else {
          await interaction.editReply(ErrorMessages.NoCoins);
        }
      }
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
