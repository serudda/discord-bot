import { Card } from '@discord-bot/db';
import { ErrorMessages } from '@discord-bot/error-handler';
import { api } from '../../api';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder().setName('buy-pack').setDescription('Compra un sobre de 3 cartas'),
  execute: async (interaction: CommandInteraction) => {
    const userId = interaction.user.id;

    try {
      const pack = await api.card.buyPack.mutate({ userId });

      if (pack?.result && pack.result.cards.length > 0) {
        let response = '🎉 ¡Has comprado un paquete y obtenido las siguientes cartas! 🎉\n';
        pack.result.cards.forEach((card?: Card) => {
          response += `- **${card?.name}** (Rareza: ${card?.rarity})\n`;
        });
        await interaction.reply(response);
      } else {
        await interaction.reply(ErrorMessages.NoCoins);
      }
    } catch (error) {
      console.error('Error buying pack:', error);
      await interaction.reply(ErrorMessages.Unknown);
    }
  },
};

export default command;
