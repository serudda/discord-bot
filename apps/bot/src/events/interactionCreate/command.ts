import type { Interaction } from 'discord.js';

export default {
  name: 'interactionCreate',
  /**
   * Handles bar command interactions.
   *
   * @param interaction - The interaction object from
   *   Discord.js.
   */
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Not found command: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command: ${interaction.commandName}`, error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};
