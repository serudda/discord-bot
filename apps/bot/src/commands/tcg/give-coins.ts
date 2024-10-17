import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, Response } from '../../api';
import { giveCoinsMsg } from '../../messages';
import { formatMsg } from '../../utils';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

enum Option {
  user = 'usuario',
  amount = 'cantidad',
}

const command = {
  data: new SlashCommandBuilder()
    .setName('give-coins')
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
    const senderId = interaction.user.id;
    const recipientId = interaction.options.get(Option.user, true).user?.id;
    const coins = interaction.options.get(Option.amount, true).value as string;

    try {
      await interaction.deferReply();

      // Check if sender is the same as recipient
      if (senderId === recipientId) {
        await interaction.editReply(ErrorMessages.GiveCoinsRecipientEqualsSender);
        return;
      }

      // Check if user exists
      if (!recipientId) {
        await interaction.editReply(ErrorMessages.UserNotFound);
        return;
      }

      const response = await api.card.giveCoins.mutate({ recipientId, senderId, amount: parseInt(coins) });

      if (response?.result.status === Response.ERROR) {
        await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);
        return;
      } else {
        const msg = formatMsg(giveCoinsMsg.description, {
          coins,
          senderId,
          recipientId,
          balance: response?.result.coins as number,
        });
        await interaction.editReply(msg);
      }

      return;
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
