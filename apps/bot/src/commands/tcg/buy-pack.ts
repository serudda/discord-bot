import { Card } from '@discord-bot/db';
import { ErrorCode, ErrorMessages } from '@discord-bot/error-handler';
import { api, Response } from '../../api';
import { mergeImages } from '../../utils';
import { TRPCClientError } from '@trpc/client';
import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from 'discord.js';

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
        const { cards } = response.result as { cards: Array<Card> };
        const backgroundImage = 'https://i.imgur.com/4JJ2x0C.png';

        const images: Array<string> = [];
        cards.forEach((card?: Card) => {
          images.push(card?.image as string);
        });

        // Convert the image to buffer
        const buffer = await mergeImages(images, backgroundImage);

        // Create a Discord attachment and send the image
        const attachment = new AttachmentBuilder(buffer, { name: 'cards.png' });

        await interaction.editReply({ files: [attachment] });
      }
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
