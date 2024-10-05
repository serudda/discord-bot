import fs from 'fs';
import path from 'path';
import { Command } from './common';
import { REST, Routes } from 'discord.js';

// Function to recursively get all .ts and .js files in a directory
const getCommandFilesRecursively = (dir: string): Array<string> => {
  let results: Array<string> = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(getCommandFilesRecursively(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      results.push(filePath);
    }
  });

  return results;
};

export const deployCommands = async () => {
  const commands: Array<Command> = [];
  const commandsPath = path.join(__dirname, './commands');

  // Read all the files in the commands directory
  const commandFiles = getCommandFilesRecursively(commandsPath);

  console.log(`Found ${commandFiles.length} commands.`);

  // Iterate over each command file and import it
  for (const file of commandFiles) {
    const command = (await import(file)).default as Command;

    // Ensure the command has a valid structure
    if (command.data) {
      commands.push(command.data.toJSON() as unknown as Command);
    } else {
      console.warn(`The command in ${file} is missing a 'data' or 'execute' property.`);
    }
  }

  // Initialize the REST client for Discord
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log(`Registering ${commands.length} commands...`);

    // Update the commands in the server
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID!, process.env.DISCORD_SERVER_ID!),
      { body: commands },
    );

    console.log('Commands registered successfully.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
};

// Run the command deployment script
deployCommands();
