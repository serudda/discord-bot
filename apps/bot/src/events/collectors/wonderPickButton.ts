import { ErrorMessages, type ErrorCode } from '@discord-bot/error-handler';
import { api, Response } from '~/api';
import { getImage } from '~/utils';
import { type UserCardWithCard } from '../../commands/tcg/open-pack';
import { WONDER_PICK_IMG_URL } from '../../common/constants/cardImage';
import { wonderPickSelect, wonderPickSelectId } from './wonderPickSelect';
import type { ButtonInteraction, CommandInteraction, TextChannel } from 'discord.js';
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  StringSelectMenuBuilder,
} from 'discord.js';

interface WonderPickOptions {
  interaction: CommandInteraction;
  cards: Array<UserCardWithCard>;
}

export const wonderPickButtonId = 'wonder-pick-button';

export const wonderPickButton = ({ interaction, cards }: WonderPickOptions): void => {
  const buttonCollector = (interaction.channel as TextChannel)?.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 900000, // 15 minutes
    filter: (i: ButtonInteraction) => i.customId === wonderPickButtonId,
  });

  buttonCollector?.on('collect', (buttonInteraction: ButtonInteraction) => {
    void (async () => {
      try {
        // Verify if the user is the same one who opened the pack
        if (buttonInteraction.user.id === interaction.user.id) {
          await buttonInteraction.reply({
            content:
              'Ya tú obtuviste tus cartas. El wonder pick de este sobre solo puede ser usado por otros usuarios.',
            ephemeral: true,
          });
          return;
        }

        await buttonInteraction.deferReply({ ephemeral: true });

        // Get user gems
        const discordId = buttonInteraction.user.id;
        const userGemsResponse = await api.user.getGems.query({ discordId });
        if (!userGemsResponse?.result || userGemsResponse?.result?.status === Response.ERROR) {
          await buttonInteraction.editReply(ErrorMessages[userGemsResponse?.result.message as ErrorCode]);
          return;
        }

        const userGems = userGemsResponse?.result.gems as number;

        // Check if user has enough gems
        if (userGems < 1) {
          await buttonInteraction.editReply({
            content: 'No tienes suficientes gemas para realizar este wonder pick.',
          });
          return;
        }

        // Create a Discord attachment and send the image
        const buffer = await getImage(WONDER_PICK_IMG_URL);
        const attachment = new AttachmentBuilder(buffer, { name: WONDER_PICK_IMG_URL });

        // Create the Select Menu
        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId(wonderPickSelectId)
          .setPlaceholder('Selecciona una carta')
          .addOptions([
            {
              label: 'Carta 1',
              value: '1',
            },
            {
              label: 'Carta 2',
              value: '2',
            },
            {
              label: 'Carta 3',
              value: '3',
            },
          ]);

        const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        await buttonInteraction.editReply({
          files: [attachment],
          content: 'Selecciona una posición',
          components: [actionRow],
        });

        // Trigger the select menu collector
        wonderPickSelect({ interaction: buttonInteraction, cards });
      } catch (error) {
        console.error('Error en el handler de "collect" de wonderPick:', error);
        if (buttonInteraction.deferred || buttonInteraction.replied) {
          await buttonInteraction.editReply({
            content: 'Ocurrió un error al procesar tu interacción.',
            components: [],
          });
        } else {
          await buttonInteraction.reply({
            content: 'Ocurrió un error al procesar tu interacción.',
            ephemeral: true,
          });
        }
      }
    })();
  });

  buttonCollector?.on('end', () => {
    void (async () => {
      try {
        await interaction.editReply({
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId(wonderPickButtonId)
                .setLabel('Este wonder pick ha expirado')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            ),
          ],
        });
      } catch (error) {
        console.error('Error al deshabilitar el botón:', error);
      }
    })();
  });
};
