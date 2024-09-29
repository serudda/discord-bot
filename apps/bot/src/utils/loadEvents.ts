import fs from 'fs';
import path from 'path';
import { Client } from 'discord.js';

export const loadEvents = async (client: Client) => {
  const eventsPath = path.join(__dirname, '..', 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);
    if (event.name) {
      if (event.once) client.once(event.name, (...args) => event.execute(...args));
      else client.on(event.name, (...args) => event.execute(...args));
    } else {
      console.log(`[WARNING] Event in ${file} is missing 'name' property.`);
    }
  }
};
