import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api } from '../../api';
import { collectionMsg } from '../../messages';
import { formatMsg } from '../../utils';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

enum Option {
  user = 'usuario',
}

const command = {
  data: new SlashCommandBuilder()
    .setName('collection')
    .setDescription('Muestra la colección de cartas de un usuario')
    .addUserOption((option) =>
      option.setName(Option.user).setDescription('Usuario del que deseas ver la colección de cartas'),
    ),
  execute: async (interaction: CommandInteraction) => {
    // Check if user field is empty, if so, get the user that sent the command
    const discordId = interaction.options.get(Option.user)?.user?.id ?? interaction.user.id;

    try {
      await interaction.deferReply();

      // Check if user exists
      if (!discordId) {
        await interaction.editReply(ErrorMessages.UserNotFound);
        return;
      }

      const response = await api.user.getByDiscordId.query({ discordId });
      if (!response) await interaction.editReply(ErrorMessages.Unknown);

      const msg = formatMsg(collectionMsg.description, {
        discordId,
        url: `https://tcg-cards.vercel.app/${response?.id}/collection/`,
      });
      await interaction.editReply(msg);
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
