import { Message } from 'discord.js';

export const onMessage = (message: Message) => {
  if (message.author.bot) return;

  const prefix = '/';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();
};
