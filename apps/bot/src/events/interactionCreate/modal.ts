import { Interaction } from 'discord.js';

export default {
  name: 'interactionCreate',
  /**
   * Handles modal interactions.
   *
   * @param interaction - The interaction object from
   *   Discord.js.
   */
  async execute(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    const modal = interaction.client.modals.get(interaction.customId);

    if (!modal) {
      console.error(`Modal not found: ${interaction.customId}`);
      return;
    }

    try {
      await modal.execute(interaction);
    } catch (error) {
      console.error(`Error executing modal: ${interaction.customId}`, error);
      await interaction.reply({ content: 'There was an error while executing this modal!', ephemeral: true });
    }
  },
};
