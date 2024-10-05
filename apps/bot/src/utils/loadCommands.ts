import fs from 'fs';
import path from 'path';
import { Command } from '../common';
import { Client, Collection } from 'discord.js';

// Function to recursively get all .ts files in a directory
const getCommandFilesRecursively = (dir: string): Array<string> => {
  let results: Array<string> = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(getCommandFilesRecursively(filePath));
    } else if (file.endsWith('.ts')) {
      results.push(filePath);
    }
  });

  return results;
};

export const loadCommands = async (client: Client) => {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = getCommandFilesRecursively(commandsPath);

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
