import { api, ErrorMessages, Response } from '~/api';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

enum Option {
  user = 'usuario',
  amount = 'cantidad',
}

const command = {
  data: new SlashCommandBuilder()
    .setName('set-coins')
    .setDescription('Asigna las monedas que desees a otro jugador')
    .addUserOption((option) =>
      option.setName(Option.user).setDescription('Usuario al que deseas asignar monedas').setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName(Option.amount)
        .setDescription('Cantidad de monedas que deseas asignar')
        .setRequired(true)
        .setMinValue(1),
    ),
  execute: async (interaction: CommandInteraction) => {
    const discordId = interaction.options.get(Option.user, true).user?.id;
    const coins = interaction.options.get(Option.amount, true).value as string;

    try {
      await interaction.deferReply();

      // Check if user exists
      if (!discordId) {
        await interaction.editReply(ErrorMessages.User.NoUser);
        return;
      }

      const setCoinResponse = await api.card.setCoins.mutate({ discordId, amount: parseInt(coins) });

      if (setCoinResponse?.result?.status === Response.ERROR)
        await interaction.editReply(setCoinResponse.result.error.message);

      if (setCoinResponse?.result && setCoinResponse.result.status === Response.SUCCESS) {
        const { coins } = setCoinResponse.result;
        const response = `🎉 ¡Has asignado ${coins} monedas a <@${discordId}>! 🎉\n`;
        await interaction.editReply(response);
      } else {
        await interaction.editReply(ErrorMessages.User.NoCoins);
      }
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(error.message);
      await interaction.editReply(ErrorMessages.Common.Unknown);
      return;
    }
  },
};

export default command;
