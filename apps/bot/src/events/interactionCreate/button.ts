import { type Command } from '~/common';
import { type Interaction } from 'discord.js';

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

    console.log('** interaction **', interaction);

    const button = interaction.client.buttons.get(interaction.customId) as Command;

    console.log('** button **', button);

    if (!button) {
      console.error(`Not found button: ${interaction.customId}`);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      await button.execute(interaction as any);
    } catch (error) {
      console.error(`Error executing button: ${interaction.customId}`, error);
      await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
    }
  },
};
