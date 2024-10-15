import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, Response } from '../../api';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

enum Option {
  user = 'usuario',
  amount = 'cantidad',
}

const command = {
  data: new SlashCommandBuilder()
    .setName('add-coins')
    .setDescription('Da monedas a otro jugador')
    .addUserOption((option) =>
      option.setName(Option.user).setDescription('Usuario al que deseas dar monedas').setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName(Option.amount)
        .setDescription('Cantidad de monedas que deseas dar')
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
        await interaction.editReply(ErrorMessages.UserNotFound);
        return;
      }

      const response = await api.card.addCoins.mutate({ discordId, amount: parseInt(coins) });

      if (response?.result.status === Response.ERROR)
        await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);

      if (response?.result?.coins) {
        const response = `🎉 ¡Has dado ${coins} monedas a <@${discordId}>! 🎉\n`;
        await interaction.editReply(response);
      } else {
        await interaction.editReply(ErrorMessages.NoCoins);
      }
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
