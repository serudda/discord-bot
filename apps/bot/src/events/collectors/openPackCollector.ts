import { api, Response } from '~/api';
import type { UserCardWithCard } from '../../commands/tcg/open-pack';
import type { ButtonInteraction, CommandInteraction, TextChannel } from 'discord.js';
import { ComponentType } from 'discord.js';

interface OpenPackCollectorOptions {
  interaction: CommandInteraction;
  cards: Array<UserCardWithCard>;
}

export const openPackCollector = ({ interaction, cards }: OpenPackCollectorOptions): void => {
  const buttonId = 'get-random-card';

  const collector = (interaction.channel as TextChannel)?.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (i: ButtonInteraction) => i.customId === buttonId,
  });

  collector?.on('collect', (innerInteraction: ButtonInteraction) => {
    void (async () => {
      await innerInteraction.deferReply();

      // Add a random card from user pack to user collection
      // TODO: Ya estamos obteniendo las cartas desde el Button. Enviar cartas completas.
      const randomCardResponse = await api.card.addRandomCardFromUserPack.mutate({
        discordId: innerInteraction.user.id,
        cards: cards.map((card) => card.card.id),
      });

      console.log('**randomCardResponse**', randomCardResponse);

      // Check if the card was added successfully
      if (randomCardResponse && randomCardResponse?.result.status === Response.ERROR) {
        await innerInteraction.editReply(randomCardResponse?.result.message as string);
        return;
      }

      const randomCard = randomCardResponse?.result.card;

      await innerInteraction.editReply({
        content: `¡Felicidades <@${innerInteraction.user.id}>! Obtuviste la carta: **${randomCard?.card.name}**`,
      });
    })();
  });

  collector?.on('end', () => {
    void (async () => {
      await interaction.editReply({
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                customId: buttonId,
                label: 'Ya no se puede obtener una carta',
                style: 1,
                disabled: true,
              },
            ],
          },
        ],
      });
    })();
  });
};
