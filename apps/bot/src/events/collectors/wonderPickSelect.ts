import { getImage } from '~/utils';
import type { UserCardWithCard } from '../../commands/tcg/open-pack';
import type { ButtonInteraction, SelectMenuInteraction, StringSelectMenuInteraction, TextChannel } from 'discord.js';
import { AttachmentBuilder, ComponentType } from 'discord.js';

interface WonderPickSelectOptions {
  interaction: ButtonInteraction | SelectMenuInteraction;
  cards: Array<UserCardWithCard>;
}

export const wonderPickSelectId = 'wonder-pick-select';

export const wonderPickSelect = ({ interaction, cards }: WonderPickSelectOptions): void => {
  const selectCollector = (interaction.channel as TextChannel)?.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: (i: StringSelectMenuInteraction) => i.customId === wonderPickSelectId && i.user.id === interaction.user.id,
  });

  selectCollector?.on('collect', (selectInteraction: StringSelectMenuInteraction) => {
    void (async () => {
      try {
        await selectInteraction.deferReply({ ephemeral: true });

        const selectedValue = selectInteraction.values[0] as string; // '1', '2', '3'
        const selectedCardIndex = parseInt(selectedValue, 10) - 1; // Convertir a índice
        const selectedCard = cards[selectedCardIndex];

        console.log('** selectedCard **', selectedCard);
        console.log('** selectedCardIndex **', selectedCardIndex);
        console.log('** selectedValue **', selectedValue);

        if (!selectedCard) {
          await selectInteraction.editReply({
            content: 'La carta seleccionada no está disponible.',
          });
          return;
        }

        // Enviar la carta seleccionada al usuario
        const cardImageBuffer = await getImage(selectedCard.card.image);
        // console.log('** cardImageBuffer **', cardImageBuffer);
        const cardAttachment = new AttachmentBuilder(cardImageBuffer, { name: 'selected-card.png' });

        //console.log('** cardAttachment **', cardAttachment);

        await selectInteraction.editReply({
          content: `¡Has seleccionado la carta número ${selectedValue}! Es **${selectedCard.card.name}**.`,
          files: [cardAttachment],
          components: [],
        });
      } catch (error) {
        console.error('Error en el handler de selección de carta:', error);
        await selectInteraction.editReply({
          content: 'Ocurrió un error al procesar tu selección.',
        });
      }
    })();
  });

  selectCollector?.on('end', (collected) => {
    if (collected.size === 0) {
      interaction
        .editReply({
          content: 'No seleccionaste ninguna carta.',
          components: [],
        })
        .catch((error) => console.error('Error al editar el mensaje:', error));
    }
  });
};
