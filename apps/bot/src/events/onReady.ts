import { registerCommands } from '../utils/registerCommands';
import { ActivityType, Client } from 'discord.js';

export const onReady = async (client: Client) => {
  console.log(`Bot is online! Logged in as ${client.user?.tag}`);

  client.user?.setPresence({
    activities: [{ name: 'Helping users!', type: ActivityType.Playing }],
    status: 'online',
  });

  await registerCommands(
    process.env.DISCORD_APPLICATION_ID!,
    process.env.DISCORD_SERVER_ID!,
    process.env.DISCORD_TOKEN!,
  );
};
