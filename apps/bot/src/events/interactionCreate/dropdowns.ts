import type { Interaction } from 'discord.js';

export default {
  name: 'interactionCreate',
  /**
   * Handles select menu interactions.
   *
   * @param interaction - The interaction object from
   *   Discord.js.
   */
  async execute(interaction: Interaction) {
    if (!interaction.isStringSelectMenu()) return;

    const selectMenu = interaction.client.dropdowns.get(interaction.customId);

    if (!selectMenu) {
      console.error(`Not found select menu: ${interaction.customId}`);
      return;
    }

    try {
      await selectMenu.execute(interaction);
    } catch (error) {
      console.error(`Error executing select menu: ${interaction.customId}`, error);
      await interaction.reply({ content: 'There was an error while executing this select menu!', ephemeral: true });
    }
  },
};
