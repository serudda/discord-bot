import { ClientWithComponents, ComponentType } from '../common';
import { getComponent } from '../utils';
import { StringSelectMenuInteraction } from 'discord.js';

export async function dropdownHandler(
  interaction: StringSelectMenuInteraction,
  client: ClientWithComponents,
): Promise<void> {
  const component = getComponent(client, ComponentType.Dropdowns, interaction.customId);

  if (!component) {
    console.error(`Dropdown not found: ${interaction.customId}`);
    return;
  }

  try {
    await component.execute(interaction, client);
  } catch (error) {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    await interaction.editReply({ content: `Error: ${error}` }).catch(() => {});
  }
}
