import { ErrorCode, ErrorMessages } from '@discord-bot/error-handler';
import { mergeImages } from '../../utils';
import { TRPCClientError } from '@trpc/client';
import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('buy-pack-concept').setDescription('Compra un sobre de 3 cartas'),
  execute: async (interaction: CommandInteraction) => {
    try {
      await interaction.deferReply();

      const images = [
        'https://i.imgur.com/mCoLdTd.png',
        'https://i.imgur.com/nglHze3.png',
        'https://i.imgur.com/A6NqqG7.png',
      ];

      const backgroundImage = 'https://i.imgur.com/4JJ2x0C.png';

      // Convert the image to buffer
      const buffer = await mergeImages(images, backgroundImage);

      // Create a Discord attachment and send the image
      const attachment = new AttachmentBuilder(buffer, { name: 'cards.png' });

      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
