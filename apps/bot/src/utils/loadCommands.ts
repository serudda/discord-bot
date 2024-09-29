import fs from 'fs';
import path from 'path';
import { ClientWithComponents, Command } from '../common';
import { Collection } from 'discord.js';

export const loadCommands = async (client: ClientWithComponents) => {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = (await import(filePath)).default as Command;
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] Command in ${file} is missing 'data' or 'execute' property.`);
    }
  }
};
