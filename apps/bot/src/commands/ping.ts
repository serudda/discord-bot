import { Message, TextChannel } from 'discord.js';

export const pingCommand = (message: Message) => {
  if (message.channel instanceof TextChannel) {
    message.channel.send('Pong! 🏓');
  }
};
