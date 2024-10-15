import { type ComponentType } from '../common';
import { type Client } from 'discord.js';

export const getComponent = (client: Client, type: ComponentType, id: string) => {
  return client[type]?.get(id);
};
