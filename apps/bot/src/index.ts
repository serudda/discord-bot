import { ClientWithComponents } from './common';
import { onMessage } from './events/onMessage';
import { onReady } from './events/onReady';
import { buttonHandler, commandHandler, dropdownHandler, modalHandler } from './interactions';
import { Client, GatewayIntentBits, Interaction } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => onReady(client));
client.on('messageCreate', onMessage);
client.login(process.env.DISCORD_TOKEN);

////////////////////////////////////////////////////////////////
// These are all the entry points for the interactionCreate event.
// This will run before any command processing, perfect for logs!
////////////////////////////////////////////////////////////////
client.on('interactionCreate', async function (interaction: Interaction) {
  if (!interaction.isCommand()) return;
  await commandHandler(interaction, client as ClientWithComponents);
});

client.on('interactionCreate', async function (interaction: Interaction) {
  if (!interaction.isButton()) return;
  await buttonHandler(interaction, client as ClientWithComponents);
});

client.on('interactionCreate', async function (interaction: Interaction) {
  if (!interaction.isStringSelectMenu()) return;
  await dropdownHandler(interaction, client as ClientWithComponents);
});

client.on('interactionCreate', async function (interaction: Interaction) {
  if (!interaction.isModalSubmit()) return;
  await modalHandler(interaction, client as ClientWithComponents);
});
