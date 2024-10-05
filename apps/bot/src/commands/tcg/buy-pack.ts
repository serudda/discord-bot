import { Card } from '@discord-bot/db';
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
        await interaction.reply('No tienes suficientes coins para comprar un paquete.');
      }
    } catch (error) {
      console.error('*** ERROR ***', error);
      await interaction.reply('Hubo un error al comprar el paquete. Por favor, intenta nuevamente.');
    }
  },
};

export default command;
