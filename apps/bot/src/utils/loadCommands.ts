import path from 'path';
import type { Command } from '../common';
import { getFilesRecursively } from './getFilesRecursively';
import type { Client } from 'discord.js';
import { Collection } from 'discord.js';

export const loadCommands = async (client: Client) => {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = getFilesRecursively(commandsPath);

  for (const file of commandFiles) {
    const command = (await import(file)).default as Command;

    // Validate the command structure
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] Command in ${file} is missing 'data' or 'execute' property.`);
    }
  }

  console.log(`Loaded ${client.commands.size} commands successfully.`);
};
