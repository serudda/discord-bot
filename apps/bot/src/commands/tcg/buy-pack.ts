import type { Card, UserCard } from '@discord-bot/db';
import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, Response } from '~/api';
import { BG_IMG_URL, FOIL_IMG_URL, RESULT_IMG_NAME } from '~/common';
import { mergeImages } from '~/utils';
import { TRPCClientError } from '@trpc/client';
import { AttachmentBuilder, SlashCommandBuilder, type CommandInteraction } from 'discord.js';

interface UserCardWithCard extends UserCard {
  card: Card;
}

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
        const { newUserCards } = response.result as { newUserCards: Array<UserCardWithCard> };

        const imageUrls: Array<string> = [];
        const foilFlags: Array<boolean> = [];

        newUserCards.forEach((userCard?: UserCardWithCard) => {
          imageUrls.push(userCard?.card.image as string);
          foilFlags.push(userCard?.isFoil ?? false);
        });

        // Convert the image to buffer
        const buffer = await mergeImages(imageUrls, foilFlags, FOIL_IMG_URL, BG_IMG_URL);

        // Create a Discord attachment and send the image
        const attachment = new AttachmentBuilder(buffer, { name: RESULT_IMG_NAME });

        await interaction.editReply({ files: [attachment] });
      }
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
