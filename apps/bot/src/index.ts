import { onMessage } from './events/onMessage';
import { onReady } from './events/onReady';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => onReady(client));
client.on('messageCreate', onMessage);
client.login(process.env.DISCORD_TOKEN);
