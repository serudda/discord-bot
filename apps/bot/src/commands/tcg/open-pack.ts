import type { Card, UserCard } from '@discord-bot/db';
import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, Response } from '~/api';
import { BG_IMG_URL, FOIL_IMG_URL, RESULT_OPEN_PACK_IMG_NAME } from '~/common';
import { wonderPickButton, wonderPickButtonId } from '~/events/collectors';
import { openPackMsg } from '~/messages';
import { formatMsg, mergeImages } from '~/utils';
import { TRPCClientError } from '@trpc/client';
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  type CommandInteraction,
} from 'discord.js';

export interface UserCardWithCard extends UserCard {
  card: Card;
}

const command = {
  data: new SlashCommandBuilder().setName('open-pack').setDescription('Abre uno de tus sobres'),
  execute: async (interaction: CommandInteraction) => {
    const discordId = interaction.user.id;

    try {
      await interaction.deferReply();
      const userResponse = await api.user.getByDiscordId.query({ discordId });

      if (userResponse?.result?.status === Response.ERROR) {
        await interaction.editReply(ErrorMessages[userResponse.result.message as ErrorCode]);
        return;
      }

      const userId = userResponse?.result.user?.id as string;
      const username = userResponse?.result.user?.username as string;
      const openPackResponse = await api.pack.openPack.mutate({ userId });

      if (openPackResponse?.result?.status === Response.ERROR) {
        await interaction.editReply(ErrorMessages[openPackResponse.result.message as ErrorCode]);
        return;
      }

      const userCards = openPackResponse?.result?.newUserCards as Array<UserCardWithCard>;
      const packs = openPackResponse?.result?.amountOfPacks as number;
      const imageUrls: Array<string> = [];
      const foilFlags: Array<boolean> = [];

      userCards.forEach((userCard?: UserCardWithCard) => {
        imageUrls.push(userCard?.card.image as string);
        foilFlags.push(userCard?.isFoil ?? false);
      });

      // Convert the image to buffer
      const buffer = await mergeImages(imageUrls, foilFlags, FOIL_IMG_URL, BG_IMG_URL);

      // Create a Discord attachment and send the image
      const attachment = new AttachmentBuilder(buffer, { name: RESULT_OPEN_PACK_IMG_NAME });

      const msg = formatMsg(openPackMsg.description, {
        discordId,
        packs,
        url: `${process.env.WEB_URL}/${username}/collection/`,
      });

      // Create a button
      const button = new ButtonBuilder()
        .setCustomId(wonderPickButtonId)
        .setLabel('✨ Wonder Pick')
        .setStyle(ButtonStyle.Primary);

      const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

      await interaction.editReply({ files: [attachment], content: msg, components: [actionRow] });

      // Trigger the button collector
      wonderPickButton({ interaction, userCards });
    } catch (error) {
      console.error('Error opening a pack', error);
      if (error instanceof TRPCClientError) await interaction.editReply(error);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
