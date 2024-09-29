import { ActivityType, Client } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  /**
   * Handles the ready event.
   *
   * @param client - The Discord client.
   */
  async execute(client: Client) {
    console.log(`Bot is online! Logged in as ${client.user?.tag}`);

    client.user?.setPresence({
      activities: [{ name: 'Helping users!', type: ActivityType.Watching }],
      status: 'online',
    });
  },
};
