import { ClientWithComponents, ComponentType } from '../common';
import { getComponent } from '../utils';
import { CommandInteraction, PermissionsBitField } from 'discord.js';

export async function commandHandler(interaction: CommandInteraction, client: ClientWithComponents): Promise<void> {
  console.log('Command: ', { commandName: interaction.commandName });
  const component = getComponent(client, ComponentType.Commands, interaction.commandName);

  if (!component) {
    console.error(`Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    if (component.admin && !interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.reply({ content: `⚠️ Only administrators can use this command!`, ephemeral: true });
      return;
    }

    if (component.owner && interaction.user.id !== 'YOURUSERID') {
      await interaction.reply({ content: `⚠️ Only bot owners can use this command!`, ephemeral: true });
      return;
    }

    await component.execute(interaction, client);
  } catch (error) {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    await interaction.editReply({ content: `Error: ${error}` }).catch(() => {});
  }
}
