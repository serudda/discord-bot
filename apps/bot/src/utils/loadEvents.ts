import fs from 'fs';
import path from 'path';
import { type Client } from 'discord.js';

/**
 * Load and register all the events in the events folder.
 *
 * @param client - The Discord client.
 */
export async function loadEvents(client: Client) {
  const eventsPath = path.join(__dirname, '..', 'events');
  const eventFolders = fs.readdirSync(eventsPath);

  for (const folderOrFile of eventFolders) {
    const fullPath = path.join(eventsPath, folderOrFile);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Si es una carpeta, carga los eventos dentro de ella
      const eventFiles = fs.readdirSync(fullPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

      for (const file of eventFiles) {
        const filePath = path.join(fullPath, file);
        const eventModule = await import(filePath);
        const event = eventModule.default;

        if (event && event.name && event.execute) {
          if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
          } else {
            client.on(event.name, (...args) => event.execute(...args));
          }
          console.log(`Event loaded: ${event.name} from ${file}`);
        } else {
          console.log(`[WARNING] The event in ${filePath} is not exporting the required properties.`);
        }
      }
    } else if (stats.isFile()) {
      if (!folderOrFile.endsWith('.ts') && !folderOrFile.endsWith('.js')) continue;

      const eventModule = await import(fullPath);
      const event = eventModule.default;

      if (event && event.name && event.execute) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`Event loaded: ${event.name} from ${folderOrFile}`);
      } else {
        console.log(`[WARNING] The event in ${fullPath} is not exporting the required properties.`);
      }
    }
  }
}
