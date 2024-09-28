import { ClientWithComponents, ComponentType } from '../common';
import { getComponent } from '../utils';
import { ButtonInteraction } from 'discord.js';

export async function buttonHandler(interaction: ButtonInteraction, client: ClientWithComponents): Promise<void> {
  const component = getComponent(client, ComponentType.Buttons, interaction.customId);

  if (!component) {
    console.error(`Button not found: ${interaction.customId}`);
    return;
  }

  try {
    await component.execute(interaction, client);
  } catch (error) {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    await interaction.editReply({ content: `Error: ${error}` }).catch(() => {});
  }
}
