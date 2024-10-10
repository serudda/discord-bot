import { ErrorCode, ErrorMessages, UserError } from '@discord-bot/error-handler';
import { api, Response } from '../../api';
import { TRPCClientError } from '@trpc/client';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('start-game').setDescription('Empieza a coleccionar cartas'),
  execute: async (interaction: CommandInteraction) => {
    try {
      const { user } = interaction;
      const avatarURL = user.displayAvatarURL({ size: 512, forceStatic: true });
      await interaction.deferReply();

      // Check if user exists
      if (!user.id) {
        await interaction.editReply(ErrorMessages.DiscordUserNotFound);
        return;
      }

      const response = await api.user.register.mutate({
        discordId: user.id,
        name: user.displayName,
        username: user.username,
        image: avatarURL,
      });

      if (response?.result.status === Response.ERROR) {
        if (response.result.message === UserError.UserAlreadyExists) {
          await interaction.editReply(
            'Ya estas coleccionando cartas.\nPuedes usar el comando `/buy-pack` para comprar sobres de cartas.',
          );
          return;
        } else {
          await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);
          return;
        }
      }

      if (response?.result && response.result.coins) {
        const msg = `¡Bienvenido ${response.result.name},\n ya puedes empezar a coleccionar cartas! Has recibido ${response.result.coins} monedas de regalo.\n Puedes usar el comando \`/buy-pack\` para comprar sobres de cartas.`;
        await interaction.editReply(msg);
      } else {
        await interaction.editReply(ErrorMessages.Unknown);
      }
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
