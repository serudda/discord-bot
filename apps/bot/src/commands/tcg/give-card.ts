import { api, ErrorMessages, Response } from '~/api';
import { giveCardMsg } from '~/messages';
import { formatMsg } from '~/utils';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

enum Option {
  user = 'usuario',
  cardNumber = 'numero',
}

const command = {
  data: new SlashCommandBuilder()
    .setName('give-card')
    .setDescription('Dar una carta a otro jugador')
    .addUserOption((option) =>
      option.setName(Option.user).setDescription('Usuario al que deseas dar la carta').setRequired(true),
    )
    .addStringOption((option) =>
      option.setName(Option.cardNumber).setDescription('Identificador de la carta que deseas dar').setRequired(true),
    ),
  execute: async (interaction: CommandInteraction) => {
    const senderId = interaction.user.id;
    const recipientId = interaction.options.get(Option.user, true).user?.id;
    const cardNumber = interaction.options.get(Option.cardNumber, true).value as string;

    try {
      await interaction.deferReply();

      // Check if sender is the same as recipient
      if (senderId === recipientId) {
        await interaction.editReply(ErrorMessages.User.GiveCardRecipientEqualsSender);
        return;
      }

      // Check if user exists
      if (!recipientId) {
        await interaction.editReply(ErrorMessages.User.NoUser);
        return;
      }

      const response = await api.card.giveCard.mutate({ recipientId, senderId, cardNumber: parseInt(cardNumber) });

      if (response?.result.status === Response.ERROR) {
        await interaction.editReply(response.result.error.message);
        return;
      } else {
        const userCard = response?.result.userCard;
        const msg = formatMsg(giveCardMsg.description, {
          senderId,
          recipientId,
          cardName: userCard.card.name,
          cardNumber: response?.result.userCard?.card.cardNumber,
        });
        await interaction.editReply(msg);
      }

      return;
    } catch (error) {
      console.log(error);
      if (error instanceof TRPCClientError) await interaction.editReply(error.message);
      await interaction.editReply(ErrorMessages.Common.Unknown);
      return;
    }
  },
};

export default command;
