import { api, configService, ErrorMessages, Response } from '~/api';
import { startGameMsg } from '~/messages';
import { formatMsg } from '~/utils';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('start-game').setDescription('Empieza a coleccionar cartas'),
  execute: async (interaction: CommandInteraction) => {
    try {
      const { user } = interaction;
      const avatarURL = user.displayAvatarURL({ size: 512, forceStatic: true });
      await interaction.deferReply();

      // Check if user exists
      if (!user.id) {
        await interaction.editReply(ErrorMessages.Account.DiscordUserNotFound);
        return;
      }

      const username = user.discriminator === '0' ? user.username : `${user.username}${user.discriminator}`;
      const response = await api.user.register.mutate({
        discordId: user.id,
        name: user.displayName,
        username,
        image: avatarURL,
      });

      if (response?.result.status === Response.ERROR) {
        await interaction.editReply(response.result.error.message);
        return;
      }

      if (response?.result && response.result.coins) {
        const coins = response?.result.coins;
        const gems = response?.result.gems;
        const coinEmoji = await configService.getGlobalConfig<string>('COIN_EMOJI', ':coin:');
        const gemEmoji = await configService.getGlobalConfig<string>('GEM_EMOJI', ':gem:');
        const msg = formatMsg(startGameMsg.description, {
          coins,
          coinEmoji,
          gems,
          gemEmoji,
        });
        await interaction.editReply(msg);
        return;
      } else {
        await interaction.editReply(ErrorMessages.Common.Unknown);
        return;
      }
    } catch (error) {
      if (error instanceof TRPCClientError) await interaction.editReply(error.message);
      await interaction.editReply(ErrorMessages.Common.Unknown);
      return;
    }
  },
};

export default command;
