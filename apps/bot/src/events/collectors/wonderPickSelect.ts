import { BACK_IMG_URL, BG_IMG_URL, FOIL_IMG_URL, RESULT_WONDER_PICK_IMG_NAME } from '~/common';
import { mergeImages } from '~/utils';
import type { UserCardWithCard } from '../../commands/tcg/open-pack';
import type { ButtonInteraction, StringSelectMenuInteraction, TextChannel } from 'discord.js';
import { AttachmentBuilder, ComponentType } from 'discord.js';

interface WonderPickSelectOptions {
  interaction: ButtonInteraction | StringSelectMenuInteraction;
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

        const selectedValue = selectInteraction.values[0] as string;
        const selectedCardIndex = parseInt(selectedValue, 10) - 1;
        const selectedCard = cards[selectedCardIndex];

        if (!selectedCard) {
          await selectInteraction.editReply({
            content: 'La carta seleccionada no está disponible.',
          });
          return;
        }

        const totalCards = cards.length;
        const imageUrls: Array<string> = [];
        const foilFlags: Array<boolean> = [];

        for (let i = 0; i < totalCards; i++) {
          imageUrls.push(i === selectedCardIndex ? selectedCard.card.image : BACK_IMG_URL);
          foilFlags.push(i === selectedCardIndex ? selectedCard.isFoil : false);
        }

        // Convert the image to buffer
        const buffer = await mergeImages(imageUrls, foilFlags, FOIL_IMG_URL, BG_IMG_URL);
        const attachment = new AttachmentBuilder(buffer, { name: RESULT_WONDER_PICK_IMG_NAME });

        await selectInteraction.editReply({
          content: `¡Has seleccionado la carta número ${selectedValue}! Es **${selectedCard.card.name}**.`,
          files: [attachment],
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

  selectCollector?.on('end', () => {
    void (async (collected) => {
      if (collected.size === 0) {
        try {
          // If the interaction has not been replied to, we can use reply()
          if (!interaction.ephemeral && !interaction.deferred && !interaction.replied) {
            await interaction.reply({
              content: 'No seleccionaste ninguna carta.',
              ephemeral: true,
            });
            // If the interaction was deferred but not replied to, we can use editReply()
          } else if (interaction.deferred && !interaction.replied) {
            await interaction.editReply({
              content: 'No seleccionaste ninguna carta.',
              components: [],
            });
            // If the interaction has been replied to, we use followUp()
          } else {
            await interaction.followUp({
              content: 'No seleccionaste ninguna carta.',
              ephemeral: true,
            });
          }
        } catch (error) {
          console.error('Error al enviar mensaje al usuario:', error);
        }
      }
    })(selectCollector?.collected);
  });
};
