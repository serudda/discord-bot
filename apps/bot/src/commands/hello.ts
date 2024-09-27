import { Message, TextChannel } from 'discord.js';

export const helloCommand = (message: Message) => {
  if (message.channel instanceof TextChannel) {
    message.channel.send(`Hello, ${message.author.username}!`);
  }
};
