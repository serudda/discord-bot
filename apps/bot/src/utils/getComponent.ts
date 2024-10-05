import { ComponentType } from '../common';
import { Client } from 'discord.js';

export const getComponent = (client: Client, type: ComponentType, id: string) => {
  return client[type]?.get(id);
};
