import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, Response } from '~/api';
import { collectionMsg } from '~/messages';
import { formatMsg } from '~/utils';
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
    try {
      await interaction.deferReply();

      // Check if user exists
      const discordId = interaction.options.get(Option.user)?.user?.id ?? interaction.user.id;
      if (!discordId) {
        await interaction.editReply(ErrorMessages.UserNotFound);
        return;
      }

      const response = await api.user.getByDiscordId.query({ discordId });
      if (response?.result.status === Response.ERROR) {
        await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);
        return;
      }

      const user = response?.result.user;
      const msg = formatMsg(collectionMsg.description, {
        discordId,
        url: `${process.env.WEB_URL}/${user?.id}/collection/`,
      });
      await interaction.editReply(msg);
    } catch (error) {
      console.error('Error executing collection command:', error);

      if (error instanceof TRPCClientError) {
        await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
        return;
      }
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
