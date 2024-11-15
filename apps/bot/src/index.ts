import { loadCommands, loadEvents } from './utils';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.buttons = new Collection();
client.dropdowns = new Collection();

void (async () => {
  try {
    await loadCommands(client);
    await loadEvents(client);
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('Failed to log in.', error);
  }
})();
