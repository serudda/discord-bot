import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, rarities, Rarity, Response } from '../../api';
import { TRPCClientError } from '@trpc/client';
import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

const getRandomRarity = () => {
  const randomNum = Math.random();
  let cumulativeProbability = 0;
  let selectedRarity = Rarity.COMMON;

  for (const rarity of rarities) {
    cumulativeProbability += rarity.probability;
    if (randomNum <= cumulativeProbability) {
      selectedRarity = rarity.rarity;
      break;
    }
  }

  return selectedRarity;
};

const command = {
  data: new SlashCommandBuilder().setName('create-card').setDescription('Crear Cartas Aleatorias'),
  execute: async (interaction: CommandInteraction) => {
    try {
      await interaction.deferReply();

      const RANDOM_AMOUNT = 50;

      // Generate random cards
      let response;
      for (let i = 0; i < RANDOM_AMOUNT; i++) {
        response = await api.card.createCard.mutate({
          name: `Random Card ${i}`,
          description: `Random Card Description ${i}`,
          imageUrl: `https://via.placeholder.com/${i}`,
          rarity: getRandomRarity(),
        });
        if (response?.result.status === Response.ERROR)
          await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);
      }

      if (response?.result.status === Response.ERROR)
        await interaction.editReply(ErrorMessages[response.result.message as ErrorCode]);

      if (response?.result?.card) {
        const response = `¡Has creado ${RANDOM_AMOUNT} cartas !\n`;
        await interaction.editReply(response);
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
