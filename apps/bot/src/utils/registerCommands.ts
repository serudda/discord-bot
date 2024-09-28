import fs from 'fs';
import path from 'path';
import { Command } from '../common';
import { REST, Routes } from 'discord.js';

// Define the function to register the commands
export const registerCommands = async (applicationId: string, guildId: string, token: string) => {
  const commands: Array<Command> = [];
  const commandsPath = path.join(__dirname, '../commands');

  // Read all the files in the commands directory
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

  console.log(`Found ${commandFiles.length} commands.`);

  // Iterate over each command file and import it
  for (const file of commandFiles) {
    const commandPath = path.join(commandsPath, file);
    const command = (await import(commandPath)).default as Command;

    // Ensure the command has a valid structure
    if (command.data) {
      commands.push(command.data.toJSON() as any);
    } else {
      console.warn(`The command in ${file} is missing a 'data' or 'execute' property.`);
    }
  }

  // Initialize the REST client for Discord
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log(`Registering ${commands.length} commands...`);

    // Update the commands in the server
    await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands });

    console.log('Commands registered successfully.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
};
