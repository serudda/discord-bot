import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, Response } from '../../api';
import { giveCoinsMsg } from '../../messages';
import { formatMsg } from '../../utils';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

enum Option {
  user = 'usuario',
  card = 'número de la carta',
}

const command = {
  data: new SlashCommandBuilder()
    .setName('give-card')
    .setDescription('Dar una carta a otro jugador')
    .addUserOption((option) =>
      option.setName(Option.user).setDescription('Usuario al que deseas dar la carta').setRequired(true),
    )
    .addStringOption((option) =>
      option.setName(Option.card).setDescription('Identificador de la carta que deseas dar').setRequired(true),
    ),
  execute: async (interaction: CommandInteraction) => {
    const senderId = interaction.user.id;
    const recipientId = interaction.options.get(Option.user, true).user?.id;
    const cardNumber = interaction.options.get(Option.card, true).value as string;

    console.log(cardNumber);

    try {
      await interaction.deferReply();

      // Check if sender is the same as recipient
      if (senderId === recipientId) {
        await interaction.editReply(ErrorMessages.GiveCardRecipientEqualsSender);
        return;
      }

      // Check if user exists
      if (!recipientId) {
        await interaction.editReply(ErrorMessages.UserNotFound);
        return;
      }

      const response = await api.card.giveCoins.mutate({ recipientId, senderId, amount: 2 });

      if (response?.result.status === Response.ERROR) {
        await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);
        return;
      } else {
        const msg = formatMsg(giveCoinsMsg.description, {
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
      return;
    }
  },
};

export default command;
