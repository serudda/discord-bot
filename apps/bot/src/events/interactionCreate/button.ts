import type { Interaction } from 'discord.js';

export default {
  name: 'interactionCreate',
  /**
   * Handles button interactions.
   *
   * @param interaction - The interaction object from
   *   Discord.js.
   */
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;

    const button = interaction.client.buttons.get(interaction.customId);

    if (!button) {
      console.error(`Not found button: ${interaction.customId}`);
      return;
    }

    try {
      await button.execute(interaction);
    } catch (error) {
      console.error(`Error executing button: ${interaction.customId}`, error);
      await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
    }
  },
};
