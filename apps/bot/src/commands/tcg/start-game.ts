import { ErrorCode, ErrorMessages } from '@discord-bot/error-handler';
import { api, Response } from '../../api';
import { TRPCClientError } from '@trpc/client';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('start-game').setDescription('Empieza a coleccionar cartas'),
  execute: async (interaction: CommandInteraction) => {
    try {
      const { id: discordId, displayName, username } = interaction.user;
      await interaction.deferReply();

      // Check if user exists
      if (!discordId) {
        await interaction.editReply(ErrorMessages.DiscordUserNotFound);
        return;
      }

      const response = await api.user.register.mutate({ discordId, name: displayName, username });

      if (response?.result.status === Response.ERROR)
        await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);

      if (response?.result && response.result.coins) {
        const msg = `¡Bienvenido ${response.result.name},\n ya puedes empezar a coleccionar cartas! Has recibido ${response.result.coins} monedas de regalo.\n Puedes usar el comando \`/buy-pack\` para comprar sobres de cartas.`;
        await interaction.editReply(msg);
      } else {
        await interaction.editReply(ErrorMessages.NoCoins);
      }
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(ErrorMessages[error.message as ErrorCode]);
      await interaction.editReply(ErrorMessages.Unknown);
    }
  },
};

export default command;
