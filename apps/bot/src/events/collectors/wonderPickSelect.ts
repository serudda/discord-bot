import { api, Response } from '~/api';
import { BACK_IMG_URL, BG_IMG_URL, FOIL_IMG_URL, RESULT_WONDER_PICK_IMG_NAME } from '~/common';
import { mergeImages } from '~/utils';
import type { UserCardWithCard } from '../../commands/tcg/open-pack';
import type { ButtonInteraction, StringSelectMenuInteraction, TextChannel } from 'discord.js';
import { AttachmentBuilder, ComponentType } from 'discord.js';

interface WonderPickSelectOptions {
  interaction: ButtonInteraction | StringSelectMenuInteraction;
  userCards: Array<UserCardWithCard>;
}

export const wonderPickSelectId = 'wonder-pick-select';

export const wonderPickSelect = ({ interaction, userCards }: WonderPickSelectOptions): void => {
  const selectCollector = (interaction.channel as TextChannel)?.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: (i: StringSelectMenuInteraction) => i.customId === wonderPickSelectId && i.user.id === interaction.user.id,
  });

  selectCollector?.on('collect', (selectInteraction: StringSelectMenuInteraction) => {
    void (async () => {
      try {
        const discordId = interaction.user.id;
        const selectedValue = selectInteraction.values[0] as string;
        await selectInteraction.deferReply({ ephemeral: true });

        // Run the wonder pick user action
        const wonderPickResponse = await api.card.wonderPick.mutate({
          discordId,
          position: selectedValue,
          cards: userCards.map((userCard) => userCard.card.id),
        });

        // Check if the wonder pick failed
        if (wonderPickResponse.result.status === Response.ERROR) {
          await selectInteraction.editReply(wonderPickResponse.result.error);
          return;
        }

        const selectedUserCard = wonderPickResponse?.result.userCard;
        const imageUrls: Array<string> = [];
        const foilFlags: Array<boolean> = [];

        // Create the image and foil flags arrays
        userCards.forEach((userCard) => {
          imageUrls.push(userCard.card.id === selectedUserCard.card.id ? selectedUserCard.card.image : BACK_IMG_URL);
          foilFlags.push(userCard.card.id === selectedUserCard.card.id ? selectedUserCard.isFoil : false);
        });

        // Convert the image to buffer
        const buffer = await mergeImages(imageUrls, foilFlags, FOIL_IMG_URL, BG_IMG_URL);
        const attachment = new AttachmentBuilder(buffer, { name: RESULT_WONDER_PICK_IMG_NAME });

        await selectInteraction.editReply({
          content: `¡Has seleccionado la carta número ${selectedValue}! Es **${selectedUserCard.card.name}**.`,
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
