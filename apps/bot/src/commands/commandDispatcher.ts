import { helloCommand } from './hello';
import { pingCommand } from './ping';
import { Message, TextChannel } from 'discord.js';

// Commands Catalog
const commands: { [key: string]: (message: Message) => void } = {
  ping: pingCommand,
  hello: helloCommand,
};

export const commandDispatcher = (message: Message, command: string) => {
  const executeCommand = commands[command];
  if (executeCommand) {
    executeCommand(message);
  } else {
    if (message.channel instanceof TextChannel) {
      message.channel.send(`Unknown command: ${command}`);
    }
  }
};
