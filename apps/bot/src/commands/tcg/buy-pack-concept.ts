import { ErrorCode, ErrorMessages } from '@discord-bot/error-handler';
import { TRPCClientError } from '@trpc/client';
import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Jimp } from 'jimp';

const command = {
  data: new SlashCommandBuilder().setName('buy-pack-concept').setDescription('Compra un sobre de 3 cartas'),
  execute: async (interaction: CommandInteraction) => {
    try {
      await interaction.deferReply();

      const image1 = 'https://i.imgur.com/mCoLdTd.png';
      const image2 = 'https://i.imgur.com/nglHze3.png';
      const image3 = 'https://i.imgur.com/A6NqqG7.png';
      const backgroundImage = 'https://i.imgur.com/4JJ2x0C.png';

      const img1 = await Jimp.read(image1);
      const img2 = await Jimp.read(image2);
      const img3 = await Jimp.read(image3);
      const background = await Jimp.read(backgroundImage);

      // Define margin
      const margin = 20; // Margin between the cards and edges

      // Determine the final image width and height with margins
      const finalWidth = img1.bitmap.width + img2.bitmap.width + img3.bitmap.width + margin * 4;
      const finalHeight = Math.max(img1.bitmap.height, img2.bitmap.height, img3.bitmap.height) + margin * 2;

      // Resize the background to match the final image size
      background.resize({ w: finalWidth, h: finalHeight });

      // Create a new blank image for the final composite
      const finalImage = new Jimp({ width: finalWidth, height: finalHeight });

      // Composite the background first
      finalImage.composite(background, 0, 0);

      // Composite the cards with margin
      finalImage.composite(img1, margin, margin);
      finalImage.composite(img2, img1.bitmap.width + margin * 2, margin);
      finalImage.composite(img3, img1.bitmap.width + img2.bitmap.width + margin * 3, margin);

      // Convert the image to buffer
      const buffer = await finalImage.getBuffer('image/png');

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
