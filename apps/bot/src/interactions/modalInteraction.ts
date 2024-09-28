import { ClientWithComponents, ComponentType } from '../common';
import { getComponent } from '../utils';
import { ModalSubmitInteraction } from 'discord.js';

export async function modalHandler(interaction: ModalSubmitInteraction, client: ClientWithComponents): Promise<void> {
  const component = getComponent(client, ComponentType.Modals, interaction.customId);

  if (!component) {
    console.error(`Modal not found: ${interaction.customId}`);
    return;
  }

  try {
    await component.execute(interaction, client);
  } catch (error) {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    await interaction.editReply({ content: `Error: ${error}` }).catch(() => {});
  }
}
